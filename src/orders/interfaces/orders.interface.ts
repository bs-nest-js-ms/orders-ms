import { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums";

export interface OrderWithProducts {
  order_items: {
    name: any;
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    order: Order;
}[];
  id: string;
  total_amount: number;
  total_items: number;
  status: OrderStatus;
  paid: boolean;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
}