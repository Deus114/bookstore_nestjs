import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'int', default: 0 })
  totalItems: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItem[];

  // Helper methods
  calculateTotals() {
    this.totalItems = this.items?.length || 0;
    this.totalAmount =
      this.items?.reduce((sum, item) => sum + Number(item.totalPrice), 0) || 0;
  }

  clear() {
    this.items = [];
    this.totalItems = 0;
    this.totalAmount = 0;
  }
}
