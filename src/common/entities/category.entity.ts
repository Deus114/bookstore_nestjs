import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';
import { IsNumber, IsString } from 'class-validator';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nameKey: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descriptionKey: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsString()
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  icon: string;

  @Column({ type: 'number', default: 0 })
  @IsNumber()
  sortOrder: number;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
