import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimVoucherDto {
  @ApiProperty({ description: 'Mã voucher cần nhận' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
