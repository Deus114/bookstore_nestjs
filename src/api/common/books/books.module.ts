import { Module } from '@nestjs/common';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [BookRepositoryModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
