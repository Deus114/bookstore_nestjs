import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CartItemResponseDto } from './cart-item.res.dto';
import { EntityId } from '@src/common/utils/types';

export class CartResponseDto {
  @ApiProperty({ description: 'Cart ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Total amount' })
  @Expose()
  totalAmount: number;

  @ApiProperty({ description: 'Total items count' })
  @Expose()
  totalItems: number;

  @ApiProperty({ description: 'Cart items', type: [CartItemResponseDto] })
  @Expose()
  items: CartItemResponseDto[];

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
