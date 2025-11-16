import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserAddressInfoDto {
  @ApiProperty({ description: 'Tên người nhận' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Địa chỉ chi tiết' })
  @Expose()
  address: string;

  @ApiProperty({ description: 'Địa chỉ mặc định' })
  @Expose()
  isDefault: boolean;
}

