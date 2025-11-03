import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrderDetailResponseDto } from './order-detail.res.dto';
import { UserAddressResponseDto } from './user-address.res.dto';
import { PreviewOrderSummaryDto } from './preview-order-summary.res.dto';

export class PreviewOrderResponseDto {
  @ApiProperty({
    description: 'Order items preview',
    type: [OrderDetailResponseDto],
  })
  @Expose()
  items: OrderDetailResponseDto[];

  @ApiProperty({
    description: 'User address',
    type: UserAddressResponseDto,
    required: false,
  })
  @Expose()
  address: UserAddressResponseDto;

  @ApiProperty({ description: 'Order summary', type: PreviewOrderSummaryDto })
  @Expose()
  summary: PreviewOrderSummaryDto;
}
