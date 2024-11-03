import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { NATS_SERVICE, OrderTCP, ProductTCP } from 'src/common/constants';
import { ChangeOrderStatusDto, CreateOrderDto, SearchOrderByDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';

@Controller()
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
    private readonly ordersService: OrdersService,
  ) { }

  @MessagePattern({ cmd: OrderTCP.CREATE_ORDER })
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const products_ids = createOrderDto.items.map(item => item.product_id);

    const products: any[] = await firstValueFrom(this.client.send({ cmd: ProductTCP.FIND_PRODUCTS_BY_IDS }, { ids: products_ids })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ));

    return this.ordersService.create(createOrderDto, products);
  }

  @MessagePattern({ cmd: OrderTCP.GET_ORDERS })
  findAll(@Payload() searchOrderByDto: SearchOrderByDto) {
    return this.ordersService.findAll(searchOrderByDto);
  }

  @MessagePattern({ cmd: OrderTCP.GET_ORDER })
  async findOne(@Payload() payload) {
    const order = await this.ordersService.findOne(payload.order_id);
    const productsIds: string[] = order.order_items.map(order_item => order_item.product_id);
    const products: any[] = await firstValueFrom(this.client.send({ cmd: ProductTCP.FIND_PRODUCTS_BY_IDS }, { ids: productsIds }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    ));;
    return {
      ...order,
      order_items: order.order_items.map(order_item => ({
        ...order_item,
        name: products.find(product => product.id === order_item.product_id).name,
      })),
    };
  }

  @MessagePattern({ cmd: OrderTCP.CHANGE_ORDER_STATUS })
  changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(changeOrderStatusDto);
  }
}
