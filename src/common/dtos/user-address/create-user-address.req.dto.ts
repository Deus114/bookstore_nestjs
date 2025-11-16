import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ description: 'Tên người nhận' })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @IsString({ message: 'Tên người nhận phải là chuỗi' })
  @MaxLength(255, { message: 'Tên người nhận không được vượt quá 255 ký tự' })
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  phone: string;

  @ApiProperty({ description: 'Địa chỉ chi tiết' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address: string;

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
}
