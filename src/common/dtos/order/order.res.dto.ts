import { ApiProperty } from '@nestjs/swagger';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '@src/common/utils/enums';
import { EntityId } from '@src/common/utils/types';
import { Expose } from 'class-transformer';
import { OrderDetailResponseDto } from './order-detail.res.dto';
import { UserAddressResponseDto } from './user-address.res.dto';

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Order code' })
  @Expose()
  orderCode: string;

  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  @Expose()
  status: OrderStatus;

  @ApiProperty({
    enum: OrderPaymentStatus,
    description: 'Payment status',
  })
  @Expose()
  paymentStatus: OrderPaymentStatus;

  @ApiProperty({ enum: OrderPaymentMethod, description: 'Payment method' })
  @Expose()
  paymentMethod: OrderPaymentMethod;

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

  @ApiProperty({ description: 'Address text' })
  @Expose()
  addressText: string;

  @ApiProperty({ description: 'Cancel reason' })
  @Expose()
  cancelReason: string;

  @ApiProperty({ description: 'Notes' })
  @Expose()
  notes: string;

  @ApiProperty({ description: 'Confirmed at' })
  @Expose()
  confirmedAt: Date;

  @ApiProperty({ description: 'Preparing at' })
  @Expose()
  preparingAt: Date;

  @ApiProperty({ description: 'Shipping at' })
  @Expose()
  shippingAt: Date;

  @ApiProperty({ description: 'Delivered at' })
  @Expose()
  deliveredAt: Date;

  @ApiProperty({ description: 'Cancelled at' })
  @Expose()
  cancelledAt: Date;

  @ApiProperty({
    description: 'Order details',
    type: [OrderDetailResponseDto],
  })
  @Expose()
  orderDetails: OrderDetailResponseDto[];

  @ApiProperty({
    description: 'User address',
    type: UserAddressResponseDto,
  })
  @Expose()
  userAddress: UserAddressResponseDto;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
