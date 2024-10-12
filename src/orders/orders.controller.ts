import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderTCP } from 'src/common/constants';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: OrderTCP.CREATE_ORDER })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: OrderTCP.GET_ORDERS })
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: OrderTCP.GET_ORDER })
  findOne(@Payload() payload) {
    return this.ordersService.findOne(payload.order_id);
  }

  @MessagePattern({ cmd: OrderTCP.CHANGE_ORDER_STATUS })
  changeOrderStatus(@Payload() payload) {
    return this.ordersService.remove(payload.order_id);
  }
}
