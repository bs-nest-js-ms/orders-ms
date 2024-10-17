import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { envs, handleExceptions } from 'src/config';
import { ChangeOrderStatusDto, CreateOrderDto, SearchOrderByDto } from './dto';
import { OrderStatus } from './enums';

@Injectable()
export class OrdersService {

  constructor (
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = this.ordersRepository.create(createOrderDto);
      return await this.ordersRepository.save(order);
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAll(searchOrderByDto: SearchOrderByDto) {
    const {limit = envs.default_limit, skip = envs.default_skip} = searchOrderByDto;
    try {
      const searchOrderQueryBuilder = this.ordersRepository.createQueryBuilder('order');
      if (searchOrderByDto.status) {
        searchOrderQueryBuilder.andWhere('order.status = :status', { status: searchOrderByDto.status });
      }

      const [orders, totalOrders] = await Promise.all([
        searchOrderQueryBuilder.take(limit).skip(skip * limit).getMany(),
        searchOrderQueryBuilder.getCount(),
      ]);

      return {
        data: orders,
        totalRecords: totalOrders,
        currentPage: skip,
      }
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.ordersRepository.findOne({where: {id: id}});
      if (!order) throw new HttpException(`Order not found`, HttpStatus.NOT_FOUND);
      return order;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async changeStatus(changeOrderStatus: ChangeOrderStatusDto) {
    try {
      const order = await this.ordersRepository.preload({id: changeOrderStatus.order_id});

      if (order.status === changeOrderStatus.status) return order;
      let paid_at: Date | null = null;

      if (changeOrderStatus.status === OrderStatus.DELIVERED) {
        paid_at = new Date();
      }

      if (!order) throw new HttpException(`Order ${changeOrderStatus.order_id} not found`, HttpStatus.NOT_FOUND);

      return await this.ordersRepository.save({...order, status: changeOrderStatus.status, paid_at: paid_at});
      
    } catch (error) {
      handleExceptions(error);
    }
  }
}
