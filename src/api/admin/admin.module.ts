import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminRoleGuard } from '@src/common/guards/admin-role.guard';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [BooksModule, UsersModule, CategoriesModule, BannersModule],
  exports: [BooksModule, UsersModule, CategoriesModule, BannersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminRoleGuard,
    },
  ],
})
export class AdminModule {}
