import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateResponseDto {
  @ApiProperty({ description: 'Entity ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;
}
