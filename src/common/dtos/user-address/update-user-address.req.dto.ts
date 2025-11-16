import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserAddressDto {
  @ApiProperty({ description: 'Tên người nhận', required: false })
  @IsOptional()
  @ValidateIf((o) => o.name !== undefined)
  @IsString({ message: 'Tên người nhận phải là chuỗi' })
  @MaxLength(255, { message: 'Tên người nhận không được vượt quá 255 ký tự' })
  name?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @ValidateIf((o) => o.phone !== undefined)
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  phone?: string;

  @ApiProperty({ description: 'Địa chỉ chi tiết', required: false })
  @IsOptional()
  @ValidateIf((o) => o.address !== undefined)
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;

  @ApiProperty({ description: 'Vĩ độ', required: false })
  @IsOptional()
  @ValidateIf((o) => o.latitude !== undefined)
  @IsNumber({}, { message: 'Vĩ độ phải là số' })
  latitude?: number;

  @ApiProperty({ description: 'Kinh độ', required: false })
  @IsOptional()
  @ValidateIf((o) => o.longitude !== undefined)
  @IsNumber({}, { message: 'Kinh độ phải là số' })
  longitude?: number;

  @ApiProperty({ description: 'Đặt làm địa chỉ mặc định', required: false })
  @IsOptional()
  @IsBoolean({ message: 'isDefault phải là boolean' })
  isDefault?: boolean;
}
