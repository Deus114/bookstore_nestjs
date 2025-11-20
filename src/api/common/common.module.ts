import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BannersModule } from './banners/banners.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { RatingsModule } from './ratings/ratings.module';
import { UsersModule } from './users/users.module';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
    BannersModule,
    UsersModule,
    VouchersModule,
    RatingsModule,
  ],
  exports: [
    AuthModule,
    BooksModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    FilesModule,
    BannersModule,
    UsersModule,
    VouchersModule,
    RatingsModule,
  ],
})
export class CommonModule {}
