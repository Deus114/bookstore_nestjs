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

export class CreateVoucherDto {
  @ApiProperty({ description: 'Tên voucher' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2025-11-15T00:00:00.000Z',
  })
  @IsDateString()
  expireDate: string;

  @ApiProperty({ description: 'Số lượng voucher' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Giới hạn mỗi người dùng' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limitPerPerson: number;

  @ApiProperty({
    description: 'Loại voucher',
    enum: VoucherType,
  })
  @IsEnum(VoucherType)
  type: VoucherType;

  @ApiProperty({
    description: 'Loại giảm giá',
    enum: VoucherDiscountType,
  })
  @IsEnum(VoucherDiscountType)
  discountType: VoucherDiscountType;

  @ApiProperty({ description: 'Mức giảm' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Giá tối thiểu để áp dụng', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ description: 'Mức giảm tối đa', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAmount?: number;

  @ApiProperty({ description: 'Mô tả voucher', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Hình ảnh voucher', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}
