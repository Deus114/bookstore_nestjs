import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController, DatabaseController } from './books.controller';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { UserRepositoryModule } from '@src/common/repositories/user';
import { OrderRepositoryModule } from '@src/common/repositories/order';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { UsersService } from '@src/api/users/users.service';
import { OrdersService } from '@src/api/orders/orders.service';

@Module({
  imports: [
    BookRepositoryModule,
    UserRepositoryModule,
    OrderRepositoryModule,
    CategoryRepositoryModule,
  ],
  controllers: [BooksController, DatabaseController],
  providers: [BooksService, UsersService, OrdersService],
  exports: [BooksService, UsersService, OrdersService],
})
export class BooksModule {}
