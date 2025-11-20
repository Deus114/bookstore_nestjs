import { IsArray, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { OrderDetail } from './order-detail.entity';
import { Rating } from './rating.entity';

@Entity('books')
export class Book extends BaseEntity {
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

  @Column({ type: 'float', nullable: false })
  @IsNumber()
  price: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  sold: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  @IsNumber()
  quantity: number;

  // Quan hệ Many-to-One với Category
  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  // Quan hệ One-to-Many với OrderDetail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.book)
  orderDetails: OrderDetail[];

  // Quan hệ One-to-Many với Rating
  @OneToMany(() => Rating, (rating) => rating.book)
  ratings: Rating[];
}
