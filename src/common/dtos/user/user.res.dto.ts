import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole, UserType } from '@src/common/utils/enums';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Full name' })
  @Expose()
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @Expose()
  phone?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  @Expose()
  avatar?: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @Expose()
  role: UserRole;

  @ApiProperty({ enum: UserType, description: 'User type' })
  @Expose()
  type: UserType;

  @ApiProperty({ description: 'Is active' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
