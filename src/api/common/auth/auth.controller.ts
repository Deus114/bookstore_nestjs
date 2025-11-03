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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccountResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from '@src/common/dtos/auth';
import { RegisterUserDto, UserLoginDto } from '@src/common/dtos/user';
import { LocalAuthGuard } from '@src/common/guards';
import { IUser } from '@src/common/utils/interfaces';
import { Public, ResponseMessage, User } from '@src/decorator/customize';
import { Request as RequestExpress, Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: UserLoginDto })
  @ResponseMessage('Đăng nhập thành công')
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: LoginResponseDto,
  })
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
  @ApiResponse({
    status: 201,
    description: 'Đăng kí thành công',
    type: RegisterResponseDto,
  })
  @Post('/register')
  async handleRegister(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerUserDto);
  }

  @ResponseMessage('Lấy thông tin người dùng thành công')
  @Get('/account')
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    type: AccountResponseDto,
  })
  handleGetAccount(@User() user: IUser): Promise<AccountResponseDto> {
    return Promise.resolve({ user });
  }

  @Public()
  @ResponseMessage('Lấy thông tin người dùng từ refresh token')
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng từ refresh token',
    type: RefreshTokenResponseDto,
  })
  @Get('/refresh')
  async handleRefreshToken(
    @Req() request: RequestExpress,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    let refreshToken = request.cookies['refreshToken'];
    return await this.authService.processRefreshToken(refreshToken, response);
  }

  @ResponseMessage('Đăng xuất thành công')
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công',
    type: LogoutResponseDto,
  })
  @Post('/logout')
  async handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    return await this.authService.logout(user, response);
  }
}
