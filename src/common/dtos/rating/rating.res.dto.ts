import { ApiProperty } from '@nestjs/swagger';
import { EntityId } from '@src/common/utils/types';
import { Expose } from 'class-transformer';

export class RatingResponseDto {
  @ApiProperty({ description: 'Rating ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Đánh giá (1-5 sao)' })
  @Expose()
  rating: number;

  @ApiProperty({ description: 'Bình luận', required: false })
  @Expose()
  comment?: string;

  @ApiProperty({
    description: 'Mảng hình ảnh đánh giá',
    type: [String],
    required: false,
  })
  @Expose()
  images?: string[];

  @ApiProperty({ description: 'Book ID' })
  @Expose()
  bookId: EntityId;

  @ApiProperty({ description: 'User ID' })
  @Expose()
  userId: EntityId;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
