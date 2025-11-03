import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import * as path from 'path';
import { AdminModule } from './api/admin/admin.module';
import { BooksModule as AdminBooksModule } from './api/admin/books/books.module';
import { UsersModule } from './api/admin/users/users.module';
import { CategoriesModule as AdminCategoriesModule } from './api/admin/categories/categories.module';
import { CommonModule } from './api/common/common.module';
import { BooksModule as CommonBooksModule } from './api/common/books/books.module';
import { CategoriesModule as CommonCategoriesModule } from './api/common/categories/categories.module';
import { AuthModule } from './api/common/auth/auth.module';
import { CartsModule } from './api/common/carts/carts.module';
import { OrdersModule } from './api/common/orders/orders.module';
import { FilesModule } from './api/common/files/files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorMessageService } from './common/services/error-message.service';
import { LoggerModule } from './common/logger';
import { configuration } from './config/configuration';
import { LanguageMiddleware } from './common/middleware/language.middleware';

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
