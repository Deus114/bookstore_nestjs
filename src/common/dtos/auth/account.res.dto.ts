import { ApiProperty } from '@nestjs/swagger';
import { UserInfoResponseDto } from './user-info.res.dto';

export class AccountResponseDto {
  @ApiProperty({ description: 'User information', type: UserInfoResponseDto })
  user: UserInfoResponseDto;
}
