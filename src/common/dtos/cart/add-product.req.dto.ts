import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { EntityId } from '@src/common/utils/types';

export class AddProductToCartDto {
  @ApiProperty({ description: 'Book ID' })
  @IsNotEmpty()
  product_id: EntityId;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
