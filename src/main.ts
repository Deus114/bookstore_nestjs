import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from './common/guards';
import { TransformInterceptor } from './core/transform.interceptor';
import { GlobalExceptionFilter } from './core/global-exception.filter';
import { LogService } from './common/logger';
import { ErrorMessageService } from './common/services/error-message.service';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  const logService = app.get(LogService);
  const errorMessageService = app.get(ErrorMessageService);
  const i18nService =
    app.get<I18nService<Record<string, unknown>>>(I18nService);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(
    new GlobalExceptionFilter(
      app.getHttpAdapter(),
      logService,
      errorMessageService,
      i18nService,
    ),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // update không mất dữ liệu
    }),
  );

  // Config CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // Config swagger
  const config = new DocumentBuilder()
    .setTitle('Bookstore APIs document')
    .setDescription('Bookstore API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });

    // Thêm Accept-Language header vào tất cả paths
    const acceptLanguageParameter = {
      name: 'Accept-Language',
      in: 'header',
      required: false,
      schema: {
        type: 'string',
        default: 'vi',
      },
      description: 'Ngôn ngữ phản hồi, ví dụ: vi, en',
    };

    // Duyệt qua tất cả paths và thêm parameter
    if (document.paths) {
      Object.keys(document.paths).forEach((path) => {
        Object.keys(document.paths[path]).forEach((method) => {
          const operation = document.paths[path][method];
          if (operation && !operation.parameters) {
            operation.parameters = [];
          }
          if (operation && operation.parameters) {
            // Kiểm tra xem parameter đã tồn tại chưa
            const exists = operation.parameters.some(
              (param: any) =>
                param.name === 'Accept-Language' && param.in === 'header',
            );
            if (!exists) {
              operation.parameters.push(acceptLanguageParameter);
            }
          }
        });
      });
    }

    return document;
  };
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(configService.get<string>('port'));
}

bootstrap();
