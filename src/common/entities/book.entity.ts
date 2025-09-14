import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { OrderDetail } from './order-detail.entity';
import { IsArray, IsNumber, IsString } from 'class-validator';

@Entity('books')
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  thumbnail: string;

  @Column({ type: 'json', nullable: true })
  @IsArray()
  slider: string[];

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  mainText: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  author: string;

  @Column({ type: 'number', nullable: false })
  @IsNumber()
  price: number;

  @Column({ type: 'number', default: 0 })
  @IsNumber()
  sold: number;

  @Column({ type: 'number', nullable: false, default: 0 })
  @IsNumber()
  quantity: number;

  // Quan hệ Many-to-One với Category
  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  // Quan hệ One-to-Many với OrderDetail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.book)
  orderDetails: OrderDetail[];
}
