import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';
import { Order } from './order.entity';

@Entity('order_details')
export class OrderDetail extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  quantity: number;

  @Column({ type: 'float', nullable: false })
  @IsNumber()
  price: number;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  bookName: string;

  // Quan hệ Many-to-One với Order
  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  // Quan hệ Many-to-One với Book
  @ManyToOne(() => Book, (book) => book.orderDetails)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
