import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AdminModule } from './api/admin/admin.module';
import { BannersModule as AdminBannersModule } from './api/admin/banners/banners.module';
import { BooksModule as AdminBooksModule } from './api/admin/books/books.module';
import { CategoriesModule as AdminCategoriesModule } from './api/admin/categories/categories.module';
import { UsersModule } from './api/admin/users/users.module';
import { VouchersModule as AdminVouchersModule } from './api/admin/vouchers/vouchers.module';
import { AuthModule } from './api/common/auth/auth.module';
import { BannersModule as CommonBannersModule } from './api/common/banners/banners.module';
import { BooksModule as CommonBooksModule } from './api/common/books/books.module';
import { CartsModule } from './api/common/carts/carts.module';
import { CategoriesModule as CommonCategoriesModule } from './api/common/categories/categories.module';
import { CommonModule } from './api/common/common.module';
import { FilesModule } from './api/common/files/files.module';
import { OrdersModule } from './api/common/orders/orders.module';
import { UsersModule as CommonUsersModule } from './api/common/users/users.module';
import { VouchersModule as CommonVouchersModule } from './api/common/vouchers/vouchers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger';
import { LanguageMiddleware } from './common/middleware/language.middleware';
import { ErrorMessageService } from './common/services/error-message.service';
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: false,
      },
      loader: I18nJsonLoader,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    AdminModule,
    CommonModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'book',
            module: AdminBooksModule,
          },
          {
            path: 'user',
            module: UsersModule,
          },
          {
            path: 'categories',
            module: AdminCategoriesModule,
          },
          {
            path: 'banners',
            module: AdminBannersModule,
          },
          {
            path: 'voucher',
            module: AdminVouchersModule,
          },
        ],
      },
      {
        path: 'common',
        module: CommonModule,
        children: [
          {
            path: 'book',
            module: CommonBooksModule,
          },
          {
            path: 'categories',
            module: CommonCategoriesModule,
          },
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'cart',
            module: CartsModule,
          },
          {
            path: 'order',
            module: OrdersModule,
          },
          {
            path: 'file',
            module: FilesModule,
          },
          {
            path: 'banners',
            module: CommonBannersModule,
          },
          {
            path: 'user',
            module: CommonUsersModule,
          },
          {
            path: 'voucher',
            module: CommonVouchersModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorMessageService,
    LanguageMiddleware,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
