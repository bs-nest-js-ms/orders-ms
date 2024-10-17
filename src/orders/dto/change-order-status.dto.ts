import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from '../enums';

export class ChangeOrderStatusDto {

  @IsUUID()
  @IsNotEmpty()
  order_id: string;
  
  @IsNotEmpty()
  @IsIn([OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.PENDING])
  status: OrderStatus;
}
