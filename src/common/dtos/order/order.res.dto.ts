import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrderPaymentType, OrderPaymentStatus } from '@src/common/utils/enums';
import { UserResponseDto } from '@src/common/dtos/user';
import { OrderDetailResponseDto } from './order-detail.res.dto';
import { EntityId } from '@src/common/utils/types';

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Customer name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Delivery address' })
  @Expose()
  address: string;

  @ApiProperty({ description: 'Phone number' })
  @Expose()
  phone: string;

  @ApiProperty({ enum: OrderPaymentType, description: 'Payment type' })
  @Expose()
  type: OrderPaymentType;

  @ApiProperty({ enum: OrderPaymentStatus, description: 'Payment status' })
  @Expose()
  paymentStatus: OrderPaymentStatus;

  @ApiProperty({ description: 'Total price' })
  @Expose()
  totalPrice: number;

  @ApiProperty({ description: 'User details', type: UserResponseDto })
  @Expose()
  user: UserResponseDto;

  @ApiProperty({ description: 'Order details', type: [OrderDetailResponseDto] })
  @Expose()
  orderDetails: OrderDetailResponseDto[];

  @ApiProperty({ description: 'Is active' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
