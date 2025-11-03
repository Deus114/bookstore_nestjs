import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PreviewOrderSummaryDto {
  @ApiProperty({ description: 'Subtotal' })
  @Expose()
  subtotal: number;

  @ApiProperty({ description: 'Shipping fee' })
  @Expose()
  shippingFee: number;

  @ApiProperty({ description: 'Discount amount' })
  @Expose()
  discountAmount: number;

  @ApiProperty({ description: 'Total amount' })
  @Expose()
  totalAmount: number;
}

