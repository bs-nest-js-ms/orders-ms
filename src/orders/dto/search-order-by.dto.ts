import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums';
import { Type } from 'class-transformer';

export class SearchOrderByDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsIn([OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.PENDING])
  status: OrderStatus;
}
