import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { startUpPrinting } from '@src/common/helpers';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  startUpPrinting(): void {
    const dbConfig = this.configService.get('db');
    startUpPrinting({
      appName: 'Bookstore API',
      env: {
        PORT: String(
          this.configService.get<number>('port') || process.env.PORT || 5001,
        ),
        DB_HOST: String(dbConfig?.host || process.env.DB_HOST || 'localhost'),
        DB_PORT: String(dbConfig?.port || process.env.DB_PORT || 5432),
        DB_NAME: String(
          dbConfig?.database || process.env.DB_NAME || 'bookstore',
        ),
        AWS_REGION: process.env.AWS_REGION,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      } as NodeJS.ProcessEnv,
    });
  }
}
