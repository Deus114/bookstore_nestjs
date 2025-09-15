import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BookResponseDto } from '@src/common/dtos/book';

export class OrderDetailResponseDto {
  @ApiProperty({ description: 'ID của order detail' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Số lượng' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Giá tiền' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Thông tin sách', type: BookResponseDto })
  @Expose()
  book: BookResponseDto;

  @ApiProperty({ description: 'Ngày tạo' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @Expose()
  updatedAt: Date;
}
