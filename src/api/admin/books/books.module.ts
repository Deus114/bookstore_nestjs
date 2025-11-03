import { Module } from '@nestjs/common';
import { OrdersModule } from '@src/api/common/orders/orders.module';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { ContentLanguageRepositoryModule } from '@src/common/repositories/content-language';
import { UsersModule } from '../users/users.module';
import { BooksController, DatabaseController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    BookRepositoryModule,
    CategoryRepositoryModule,
    ContentLanguageRepositoryModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [BooksController, DatabaseController],
  providers: [BooksService],
})
export class BooksModule {}
