import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '../utils/enums';
import { BaseEntity } from './base.entity';
import { OrderDetail } from './order-detail.entity';
import { UserAddress } from './user-address.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  orderCode: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.PENDING,
  })
  paymentStatus: OrderPaymentStatus;

  @Column({
    type: 'enum',
    enum: OrderPaymentMethod,
    nullable: false,
  })
  paymentMethod: OrderPaymentMethod;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  shippingFee: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  addressText: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancelReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  preparingAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  shippingAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => UserAddress)
  @JoinColumn({ name: 'userAddressId' })
  userAddress: UserAddress;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetail[];

  // Helper methods
  generateOrderCode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `BK${year}${month}${day}${hour}${minute}${random}`;
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    const now = new Date();
    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        this.confirmedAt = now;
        break;
      case OrderStatus.PREPARING:
        this.preparingAt = now;
        break;
      case OrderStatus.SHIPPING:
        this.shippingAt = now;
        break;
      case OrderStatus.DELIVERED:
        this.deliveredAt = now;
        break;
      case OrderStatus.CANCELLED:
        this.cancelledAt = now;
        break;
    }
  }

  updatePaymentStatus(newStatus: OrderPaymentStatus) {
    this.paymentStatus = newStatus;
  }

  updateAddressText(address: UserAddress) {
    if (address) {
      const parts = [
        address.name,
        address.phone,
        address.address,
        address.latitude ? `lat:${address.latitude}` : '',
        address.longitude ? `lng:${address.longitude}` : '',
      ].filter(Boolean);
      this.addressText = parts.join(', ');
    }
  }
}
