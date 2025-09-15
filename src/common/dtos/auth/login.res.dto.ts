import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserInfoResponseDto } from './user-info.res.dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  @Expose()
  access_token: string;

  @ApiProperty({ description: 'User information', type: UserInfoResponseDto })
  @Expose()
  user: UserInfoResponseDto;
}
