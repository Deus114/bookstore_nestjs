import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/api/admin/users/users.service';
import {
  AccountResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from '@src/common/dtos/auth';
import { RegisterUserDto } from '@src/common/dtos/user';
import { UserInfoResource } from '@src/common/resources';
import { IUser, UserPayload } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.userRepo.findByEmail(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) return user;
    }

    return null;
  }

  async login(user: IUser, response: Response): Promise<LoginResponseDto> {
    const { id, fullName, phone, email, role, avatar, gender } = user;

    // Load user with addresses
    const userWithAddresses = await this.usersService.userRepo.findOne(
      id as EntityId,
      ['addresses'],
    );

    const payload: UserPayload = {
      sub: 'token login',
      iss: 'from server',
      id,
      fullName,
      email,
      phone,
      role,
      avatar,
      gender,
    };

    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateRefreshToken(refresh_token, id as EntityId);

    response.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('jwtRefreshExpire')),
    });

    const userInfo = UserInfoResource(userWithAddresses || (user as any));

    return {
      access_token: this.jwtService.sign(payload),
      user: userInfo,
    };
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    const res = await this.usersService.register(registerUserDto);
    return res;
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtRefreshSecret'),
      expiresIn: ms(this.configService.get<string>('jwtRefreshExpire')) / 1000,
    });
    return refreshToken;
  };

  processRefreshToken = async (
    refreshToken: string,
    response: Response,
  ): Promise<RefreshTokenResponseDto> => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
      });
      const user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        // Load user with addresses
        const userWithAddresses = await this.usersService.userRepo.findOne(
          user.id as EntityId,
          ['addresses'],
        );

        const { id, fullName, email, role, avatar, phone, gender } =
          userWithAddresses || user;
        const payload: UserPayload = {
          sub: 'token login',
          iss: 'from server',
          id,
          fullName,
          email,
          phone,
          role,
          avatar,
          gender,
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(
          refresh_token,
          id as EntityId,
        );

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
        throw new BadRequestException({
          errorCode: 'INVALID_REFRESH_TOKEN',
        });
      }
    } catch (error) {
      throw new BadRequestException({
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }
  };

  logout = async (
    user: IUser,
    response: Response,
  ): Promise<LogoutResponseDto> => {
    if (!user || !user.id) {
      throw new BadRequestException({
        errorCode: 'USER_NOT_FOUND',
      });
    }
    await this.usersService.updateRefreshToken('', user.id as EntityId);
    response.clearCookie('refreshToken');
    return { message: 'Đăng xuất thành công' };
  };

  async getAccount(user: IUser): Promise<AccountResponseDto> {
    // Load user with addresses
    const userWithAddresses = await this.usersService.userRepo.findOne(
      user.id as EntityId,
      ['addresses'],
    );
    return { user: UserInfoResource(userWithAddresses || (user as any)) };
  }
}
