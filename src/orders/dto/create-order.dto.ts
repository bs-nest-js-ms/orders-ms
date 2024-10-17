import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { OrderStatus } from '../enums';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total_items: number;

  @IsEnum(OrderStatus, { message: `Possible status for status: ${OrderStatus}` })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

}
