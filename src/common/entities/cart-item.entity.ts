import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Cart } from './cart.entity';
import { Book } from './book.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  totalPrice: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  // Helper method
  updateQuantity(newQuantity: number, unitPrice: number) {
    this.quantity = newQuantity;
    this.unitPrice = unitPrice;
    this.totalPrice = Number((newQuantity * unitPrice).toFixed(2));
    if (this.cart) {
      this.cart.calculateTotals();
    }
  }
}
