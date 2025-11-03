import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  IsInt,
  Min,
} from 'class-validator';
import { OrderPaymentMethod } from '@src/common/utils/enums';
import { EntityId } from '@src/common/utils/types';

export class CreateOrderDto {
  @ApiProperty({ description: 'User address ID' })
  @IsNotEmpty()
  user_address_id: EntityId;

  @ApiProperty({
    description: 'Payment method',
    enum: OrderPaymentMethod,
  })
  @IsNotEmpty()
  @IsEnum(OrderPaymentMethod)
  payment_method: OrderPaymentMethod;

  @ApiProperty({ description: 'Notes', required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Source: cart or buy_now',
    enum: ['cart', 'buy_now'],
    default: 'cart',
  })
  @IsOptional()
  @IsEnum(['cart', 'buy_now'])
  source?: 'cart' | 'buy_now';

  // If source is 'cart'
  @ApiProperty({
    description: 'Cart item IDs (comma-separated) - required if source is cart',
    required: false,
  })
  @ValidateIf((o) => o.source === 'cart' || !o.source)
  @IsNotEmpty()
  item_ids?: string;

  // If source is 'buy_now'
  @ApiProperty({
    description: 'Product ID - required if source is buy_now',
    required: false,
  })
  @ValidateIf((o) => o.source === 'buy_now')
  @IsNotEmpty()
  product_id?: EntityId;

  @ApiProperty({
    description: 'Quantity - required if source is buy_now',
    required: false,
    minimum: 1,
  })
  @ValidateIf((o) => o.source === 'buy_now')
  @IsInt()
  @Min(1)
  quantity?: number;
}
