import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityId } from '../utils/types';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';

@Entity('categories')
export class Category extends BaseEntity {
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

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  sortOrder: number;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
