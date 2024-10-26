import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name: 'order_items'})
export class OrderItem {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid', nullable: false})
    product_id: string;

    @Column({type: 'decimal', nullable: false})
    quantity: number;

    @Column({type: 'decimal', nullable: false})
    price: number;

    @ManyToOne(() => Order, (order) => order.order_items)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}