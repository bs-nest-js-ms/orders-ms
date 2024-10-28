import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';
import { MicroservicesEnum } from 'src/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MicroservicesEnum.PRODUCT_MS,
        transport: Transport.TCP,
        options: {
          host: envs.products_microservice_host,
          port: envs.products_microservice_port,
        },
      }
    ]),
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
