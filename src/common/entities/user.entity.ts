import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { UserRole, UserType } from '../utils/enums';

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

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: UserType.SYSTEM })
  type: UserType;

  // Quan hệ One-to-Many với Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
