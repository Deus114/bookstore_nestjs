import { ApiProperty } from '@nestjs/swagger';
import { VoucherDiscountType, VoucherType } from '@src/common/utils/enums';
import { Expose } from 'class-transformer';

export class VoucherResponseDto {
  @ApiProperty({ description: 'Voucher ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Tên voucher' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã voucher' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Expose()
  expireDate: Date;

  @ApiProperty({ description: 'Số lượng còn lại' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Giới hạn mỗi người dùng' })
  @Expose()
  limitPerPerson: number;

  @ApiProperty({ description: 'Loại voucher', enum: VoucherType })
  @Expose()
  type: VoucherType;

  @ApiProperty({
    description: 'Loại giảm giá',
    enum: VoucherDiscountType,
  })
  @Expose()
  discountType: VoucherDiscountType;

  @ApiProperty({ description: 'Mức giảm' })
  @Expose()
  amount: number;

  @ApiProperty({ description: 'Giá tối thiểu để áp dụng' })
  @Expose()
  minPrice: number;

  @ApiProperty({ description: 'Mức giảm tối đa', required: false })
  @Expose()
  maxAmount?: number;

  @ApiProperty({ description: 'Mô tả voucher', required: false })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Hình ảnh voucher', required: false })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Ngày tạo' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @Expose()
  updatedAt: Date;
}
