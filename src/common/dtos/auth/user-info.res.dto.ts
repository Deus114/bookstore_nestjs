import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Gender } from '@src/common/utils/enums';
import { UserAddressInfoDto } from './user-address-info.dto';

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

  @ApiProperty({ description: 'Gender', enum: Gender, required: false })
  @Expose()
  gender?: Gender;

  @ApiProperty({
    description: 'Date of birth',
    type: 'string',
    format: 'date',
    required: false,
  })
  @Expose()
  dob?: Date;

  @ApiProperty({
    description: 'Danh sách địa chỉ người dùng',
    type: [UserAddressInfoDto],
  })
  @Expose()
  addresses: UserAddressInfoDto[];
}
