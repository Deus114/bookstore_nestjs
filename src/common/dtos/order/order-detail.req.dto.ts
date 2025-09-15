import { ApiProperty } from '@nestjs/swagger';
import { EntityId } from '@src/common/utils/types';
import { IsNumber, IsString, Min } from 'class-validator';

export class OrderDetailDto {
  @ApiProperty({ description: 'ID của sách' })
  @IsString()
  bookId: EntityId;

  @ApiProperty({ description: 'Số lượng' })
  @IsNumber()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @ApiProperty({ description: 'Giá tiền' })
  @IsNumber()
  @Min(0, { message: 'Giá tiền phải lớn hơn hoặc bằng 0' })
  price: number;
}
