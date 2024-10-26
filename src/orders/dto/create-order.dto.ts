import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // esto examina que lo que venga dentro del arreglo en este caso productos tengan la estructura de un producto
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
