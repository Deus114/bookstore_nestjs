import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { VoucherResponseDto } from './voucher.res.dto';

export class UserVoucherResponseDto {
  @ApiProperty({ description: 'Thông tin voucher', type: VoucherResponseDto })
  @Expose()
  @Type(() => VoucherResponseDto)
  voucher: VoucherResponseDto;

  @ApiProperty({ description: 'Số lượng voucher mà user đang sở hữu' })
  @Expose()
  quantity: number;
}
