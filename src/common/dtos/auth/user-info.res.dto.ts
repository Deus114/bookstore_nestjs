import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserInfoResponseDto {
  @ApiProperty({ description: 'User ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Email' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'User role' })
  @Expose()
  role: string;

  @ApiProperty({ description: 'Avatar URL' })
  @Expose()
  avatar: string;

  @ApiProperty({ description: 'Full name' })
  @Expose()
  fullName: string;
}
