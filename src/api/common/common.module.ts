import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
    BannersModule,
  ],
  exports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
    BannersModule,
  ],
})
export class CommonModule {}
