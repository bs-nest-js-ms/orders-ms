import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
@Module({
  imports: [
    OrdersModule, 
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: envs.postgres_port,
      username: envs.postgres_user,
      password: envs.postgres_password,
      database: envs.postgres_db,
      autoLoadEntities: true,
      synchronize: true,
      logging: ['query', 'error'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
