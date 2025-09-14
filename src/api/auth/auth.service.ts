import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RegisterUserDto } from '@src/common/dto/user';
import { IUser, UserPayload } from '@src/common/utils/interfaces';
import { UsersService } from '@src/api/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      let isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) return user;
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const { id, fullName, phone, email, role, avatar } = user;
    const payload: UserPayload = {
      sub: 'token login',
      iss: 'from server',
      id,
      fullName,
      email,
      phone,
      role,
      avatar,
    };

    let refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateRefreshToken(refresh_token, id);

    response.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('jwtRefreshExpire')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: id,
        email,
        phone,
        role,
        avatar,
        fullName,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    let res = await this.usersService.register(registerUserDto);
    return res;
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtRefreshSecret'),
      expiresIn: ms(this.configService.get<string>('jwtRefreshExpire')) / 1000,
    });
    return refreshToken;
  };

  processRefreshToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
      });
      let user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        const { id, fullName, email, role, avatar, phone } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          id,
          fullName,
          email,
          phone,
          role,
          avatar,
        };
        let refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(refresh_token, id);

        response.clearCookie('refreshToken');
        response.cookie('refreshToken', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('jwtRefreshExpire')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          id,
          fullName,
          email,
          role,
          avatar,
          phone,
        };
      } else {
        throw new BadRequestException(
          `Refresh token không hợp lệ, vui lòng đăng nhập`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `Refresh token không hợp lệ, vui lòng đăng nhập`,
      );
    }
  };

  logout = async (user: IUser, response: Response) => {
    await this.usersService.updateRefreshToken('', user.id);
    response.clearCookie('refreshToken');
    return 'ok';
  };
}
