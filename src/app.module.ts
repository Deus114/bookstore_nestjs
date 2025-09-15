import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './api/auth/auth.module';
import { BooksModule } from './api/books/books.module';
import { FilesModule } from './api/files/files.module';
import { OrdersModule } from './api/orders/orders.module';
import { UsersModule } from './api/users/users.module';
import { CategoriesModule } from './api/categories/categories.module';
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
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    UsersModule,
    AuthModule,
    FilesModule,
    BooksModule,
    OrdersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorMessageService,
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
