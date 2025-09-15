import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { AuthService } from '@src/api/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private errorMessageService: ErrorMessageService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        message: this.errorMessageService.getMessage('INVALID_CREDENTIALS'),
        errorCode: 'INVALID_CREDENTIALS',
      });
    }
    return user;
  }
}
