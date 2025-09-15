import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController, DatabaseController } from './books.controller';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { UserRepositoryModule } from '@src/common/repositories/user';
import { OrderRepositoryModule } from '@src/common/repositories/order';
import { OrderDetailRepositoryModule } from '@src/common/repositories/order-detail';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { UsersService } from '@src/api/users/users.service';
import { OrdersService } from '@src/api/orders/orders.service';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { OrderRepositoryService } from '@src/common/repositories/order';
import { Order, OrderDetail } from '@src/common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    BookRepositoryModule,
    UserRepositoryModule,
    OrderRepositoryModule,
    OrderDetailRepositoryModule,
    CategoryRepositoryModule,
  ],
  controllers: [BooksController, DatabaseController],
  providers: [
    BooksService,
    UsersService,
    OrdersService,
    ErrorMessageService,
    OrderRepositoryService,
  ],
  exports: [BooksService, UsersService, OrdersService],
})
export class BooksModule {}
