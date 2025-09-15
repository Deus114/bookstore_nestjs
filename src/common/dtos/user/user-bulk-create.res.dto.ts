import { ApiProperty } from '@nestjs/swagger';

export class UserBulkCreateResponseDto {
  @ApiProperty({ description: 'Number of successful creations' })
  countSuccess: number;

  @ApiProperty({ description: 'Number of failed creations' })
  countError: number;
}
