import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/common/dtos/common';
import { VoucherDiscountType, VoucherType } from '@src/common/utils/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class VoucherQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Loại voucher',
    enum: VoucherType,
    required: false,
    example: VoucherType.DISCOUNT,
  })
  @IsOptional()
  @IsEnum(VoucherType)
  type?: VoucherType;

  @ApiProperty({
    description: 'Loại giảm giá',
    enum: VoucherDiscountType,
    required: false,
    example: VoucherDiscountType.PERCENTAGE,
  })
  @IsOptional()
  @IsEnum(VoucherDiscountType)
  discountType?: VoucherDiscountType;
}
