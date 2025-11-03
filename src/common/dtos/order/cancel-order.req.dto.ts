import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty({ description: 'Cancel reason', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  reason: string;
}
