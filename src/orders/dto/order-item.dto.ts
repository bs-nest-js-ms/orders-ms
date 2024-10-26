import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
