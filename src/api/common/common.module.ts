import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
  ],
  exports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
  ],
})
export class CommonModule {}
