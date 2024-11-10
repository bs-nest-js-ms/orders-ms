import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '../enums';
import { OrderItem } from './order-item.entity';
import { OrderReceipt } from './order-receipt.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0, nullable: false })
  total_amount: number;

  @Column({ type: 'int', nullable: false })
  total_items: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ type: 'varchar', nullable: true})
  stripe_charge_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {cascade: true})
  order_items: OrderItem[]; 

  @OneToOne(() => OrderReceipt, (orderReceipt) => orderReceipt.order) 
  order_receipt: OrderReceipt;
}
