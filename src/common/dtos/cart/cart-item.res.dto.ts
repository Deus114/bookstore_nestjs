import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BookResponseDto } from '@src/common/dtos/book';
import { EntityId } from '@src/common/utils/types';

export class CartItemResponseDto {
  @ApiProperty({ description: 'Cart item ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Quantity' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @Expose()
  unitPrice: number;

  @ApiProperty({ description: 'Total price' })
  @Expose()
  totalPrice: number;

  @ApiProperty({ description: 'Book details', type: BookResponseDto })
  @Expose()
  book: BookResponseDto;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
