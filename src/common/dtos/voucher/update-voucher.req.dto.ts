import { ApiProperty } from '@nestjs/swagger';
import { VoucherDiscountType, VoucherType } from '@src/common/utils/enums';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateVoucherDto {
  @ApiProperty({ description: 'Tên voucher', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Mã voucher', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ApiProperty({
    example: '2025-11-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expireDate?: string;

  @ApiProperty({ description: 'Số lượng voucher', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiProperty({ description: 'Giới hạn mỗi người dùng', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limitPerPerson?: number;

  @ApiProperty({
    description: 'Loại voucher',
    enum: VoucherType,
    required: false,
  })
  @IsOptional()
  @IsEnum(VoucherType)
  type?: VoucherType;

  @ApiProperty({
    description: 'Loại giảm giá',
    enum: VoucherDiscountType,
    required: false,
  })
  @IsOptional()
  @IsEnum(VoucherDiscountType)
  discountType?: VoucherDiscountType;

  @ApiProperty({ description: 'Mức giảm', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ description: 'Giá tối thiểu để áp dụng', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ description: 'Mức giảm tối đa', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiProperty({ description: 'Mô tả voucher', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Hình ảnh voucher', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
