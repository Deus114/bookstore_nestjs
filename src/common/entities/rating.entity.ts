import { IsArray } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity('ratings')
export class Rating extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  rating: number; // 1-5 sao

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'json', nullable: true })
  @IsArray()
  images: string[];

  @ManyToOne(() => Book, (book) => book.ratings)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;
}
