import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderPaymentType, OrderPaymentStatus } from '../utils/enums';
import { IsEnum, IsNumber, IsString } from 'class-validator';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  address: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  phone: string;

  @Column({ type: 'enum', enum: OrderPaymentType })
  @IsEnum(OrderPaymentType)
  type: OrderPaymentType;

  @Column({
    type: 'enum',
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.UNPAID,
  })
  @IsEnum(OrderPaymentStatus)
  paymentStatus: OrderPaymentStatus;

  @Column({ type: 'number', nullable: false })
  @IsNumber()
  totalPrice: number;

  // Quan hệ Many-to-One với User
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Quan hệ One-to-Many với OrderDetail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
