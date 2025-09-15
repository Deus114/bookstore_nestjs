import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DashboardResponseDto {
  @ApiProperty({ description: 'User count' })
  @Expose()
  countUser: number;

  @ApiProperty({ description: 'Book count' })
  @Expose()
  countBook: number;

  @ApiProperty({ description: 'Order count' })
  @Expose()
  countOrder: number;
}
