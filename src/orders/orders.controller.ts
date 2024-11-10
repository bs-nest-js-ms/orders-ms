import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { NATS_SERVICE, OrderTCP, PaymentTCP, ProductTCP } from 'src/common/constants';
import { ChangeOrderStatusDto, CreateOrderDto, PaidOrderDto, SearchOrderByDto } from './dto';
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

    const order = await this.ordersService.create(createOrderDto, products);
    const paymentSession =  await firstValueFrom(this.client.send(PaymentTCP.CREATE_PAYMENT, {
      order_id: order.id,
      currency: 'usd',
      items: order.order_items.map(order_item => ({
        name: order_item.name,
        price: order_item.price,
        quantity: order_item.quantity,
      })),
    }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    ));
    
    return {
      order,
      paymentSession,
    };
    
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

  @EventPattern(PaymentTCP.SUCCEDED_PAYMENT)
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    //console.log('orders-ms: ', { paidOrderDto });
    return this.ordersService.paidOrder(paidOrderDto);
    return;
  }
  
}
