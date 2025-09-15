import { plainToClass } from 'class-transformer';
import { Book } from '../entities';
import { BookResponseDto } from '../dtos/book';

export function BooksResource(books: Book[]): BookResponseDto[] {
  return books && books.length
    ? books.map((book) => {
        return BookResource(book);
      })
    : [];
}

export function BookResource(book: Book): BookResponseDto {
  return plainToClass(BookResponseDto, book, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
