import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gender, UserRole, UserType } from '../utils/enums';
import { BaseEntity } from './base.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Rating } from './rating.entity';
import { UserAddress } from './user-address.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: UserType.SYSTEM })
  type: UserType;

  // Quan hệ One-to-Many với Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Quan hệ One-to-Many với Cart
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  // Quan hệ One-to-Many với UserAddress
  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];

  // Quan hệ One-to-Many với Rating
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
