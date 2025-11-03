import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @ApiProperty({
    description: 'Change quantity (-1 to decrease, 1 to increase)',
    enum: [-1, 1],
  })
  @IsNotEmpty()
  @IsIn([-1, 1])
  change: number;
}
