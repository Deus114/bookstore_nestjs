import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminRoleGuard } from '@src/common/guards/admin-role.guard';
import { BannersModule } from './banners/banners.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [
    BooksModule,
    UsersModule,
    CategoriesModule,
    BannersModule,
    VouchersModule,
  ],
  exports: [
    BooksModule,
    UsersModule,
    CategoriesModule,
    BannersModule,
    VouchersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminRoleGuard,
    },
  ],
})
export class AdminModule {}
