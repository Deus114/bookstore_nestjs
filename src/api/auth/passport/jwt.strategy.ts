import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwtSecret') || 'default-secret-key',
    });
  }

  async validate(payload: any) {
    const { _id, fullName, email, role, avatar, phone } = payload;
    return {
      _id,
      fullName,
      email,
      role,
      avatar,
      phone,
    };
  }
}
