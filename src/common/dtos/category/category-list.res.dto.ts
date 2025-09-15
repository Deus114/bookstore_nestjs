import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category.res.dto';

export class CategoryListResponseDto {
  @ApiProperty({
    description: 'Danh sách categories',
    type: [CategoryResponseDto],
  })
  data: CategoryResponseDto[];

  @ApiProperty({ description: 'Thông báo' })
  message: string;

  @ApiProperty({ description: 'Tổng số lượng' })
  total?: number;
}
