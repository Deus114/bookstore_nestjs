import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Request as RequestExpress, Response } from 'express';
import { Public, ResponseMessage, User } from '@src/decorator/customize';
import { RegisterUserDto, UserLoginDto } from '@src/common/dtos/user';
import {
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
} from '@src/common/dtos/auth';
import { IUser } from '@src/common/utils/interfaces';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: UserLoginDto })
  @ResponseMessage('Đăng nhập thành công')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Đăng kí thành công')
  @Post('/register')
  async handleRegister(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerUserDto);
  }

  @ResponseMessage('Lấy thông tin người dùng thành công')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('Lấy thông tin người dùng từ refresh token')
  @Get('/refresh')
  async handleRefreshToken(
    @Req() request: RequestExpress,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    let refreshToken = request.cookies['refreshToken'];
    return await this.authService.processRefreshToken(refreshToken, response);
  }

  @ResponseMessage('Đăng xuất thành công')
  @Post('/logout')
  async handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    return await this.authService.logout(user, response);
  }
}
