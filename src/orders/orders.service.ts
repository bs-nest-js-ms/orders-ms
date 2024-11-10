import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { envs, handleExceptions } from 'src/config';
import { ChangeOrderStatusDto, CreateOrderDto, PaidOrderDto, SearchOrderByDto } from './dto';
import { OrderStatus } from './enums';
import { OrderItem } from './entities/order-item.entity';
import { OrderReceipt } from './entities/order-receipt.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderDetailRepository: Repository<OrderItem>,
    @InjectRepository(OrderReceipt)
    private readonly orderReceiptRepository: Repository<OrderReceipt>,
  ) { }

  async create(createOrderDto: CreateOrderDto, products: any[]) {
    try {
      const total_amount = createOrderDto.items.reduce((totalAmountProductsAcc, order_item) => {
        const product = products.find(product => product.id === order_item.product_id);
        return product.price * order_item.quantity + totalAmountProductsAcc;
      }, 0);

      const total_items = createOrderDto.items.reduce((totalProductItemsAcc, order_item) => {
        return totalProductItemsAcc + order_item.quantity
      }, 0);

      const order = await this.ordersRepository.create({
        total_amount: total_amount,
        total_items: total_items,
        order_items: createOrderDto.items.map(order_item => this.orderDetailRepository.create({
          product_id: order_item.product_id,
          price: products.find(product => product.id === order_item.product_id).price,
          quantity: order_item.quantity,
        })),
      });

      const savedOrder = await this.ordersRepository.save(order);
      return {
        ...savedOrder,
        order_items: savedOrder.order_items.map(order_item => ({
          ...order_item,
          name: products.find(product => product.id === order_item.product_id).name,
        }))
      };
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAll(searchOrderByDto: SearchOrderByDto) {
    const { limit = envs.default_limit, skip = envs.default_skip } = searchOrderByDto;
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
      const order = await this.ordersRepository.findOne({ where: { id: id }, relations: ['order_items'] });
      if (!order) throw new HttpException(`Order not found`, HttpStatus.NOT_FOUND);
      return order;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async changeStatus(changeOrderStatus: ChangeOrderStatusDto) {
    try {
      const order = await this.ordersRepository.preload({ id: changeOrderStatus.order_id });

      if (order.status === changeOrderStatus.status) return order;
      let paid_at: Date | null = null;

      if (changeOrderStatus.status === OrderStatus.DELIVERED) {
        paid_at = new Date();
      }

      if (!order) throw new HttpException(`Order ${changeOrderStatus.order_id} not found`, HttpStatus.NOT_FOUND);

      return await this.ordersRepository.save({ ...order, status: changeOrderStatus.status, paid_at: paid_at });

    } catch (error) {
      handleExceptions(error);
    }
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {
    try {

      // Actualizamos orden
      const order = await this.ordersRepository.findOneBy({id: paidOrderDto.order_id});
      if (!order) throw new HttpException(`Order ${paidOrderDto.order_id} not found`, HttpStatus.NOT_FOUND);

      // Creamos detalle en la relacion 1:1
      const orderPaid = await this.ordersRepository.save({
        ...order, 
        status: OrderStatus.PAID, 
        stripe_charge_id: paidOrderDto.stripe_charge_id
      });
      if (orderPaid.stripe_charge_id.trim().length !== 0 && orderPaid.status === OrderStatus.PAID) {
        const orderReceipt = await this.orderReceiptRepository.create({order: orderPaid, receipt_url: paidOrderDto.receipt_url});
        await this.orderReceiptRepository.save(orderReceipt);
      }
      return orderPaid;
    } catch (error) {
      handleExceptions(error);
    }
  }
}
