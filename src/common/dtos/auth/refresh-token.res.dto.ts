import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@src/common/utils/enums';

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({ description: 'Avatar URL', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;
}
