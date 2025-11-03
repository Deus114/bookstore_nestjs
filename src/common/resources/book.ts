import { plainToClass } from 'class-transformer';
import { Book } from '../entities';
import { BookResponseDto } from '../dtos/book';
import { CategoryResponseDto } from '../dtos/category';

export function BooksResource(
  books: Book[],
  categoryMap?: Map<string, CategoryResponseDto>,
): BookResponseDto[] {
  return books && books.length
    ? books.map((book) => {
        return BookResource(book, categoryMap?.get(book.category?.id));
      })
    : [];
}

export function BookResource(
  book: Book,
  categoryDto?: CategoryResponseDto | null,
): BookResponseDto {
  const bookDto = plainToClass(BookResponseDto, book, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  if (categoryDto !== undefined) {
    bookDto.category = categoryDto;
  }

  return bookDto;
}
