import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/api/common/auth/auth.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
}
