import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID của category' })
  id: string;

  @ApiProperty({ description: 'Tên category' })
  name: string;

  @ApiProperty({ description: 'Mô tả category', required: false })
  description?: string;

  @ApiProperty({ description: 'URL slug' })
  slug: string;

  @ApiProperty({ description: 'Icon URL', required: false })
  icon?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  sortOrder: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  isActive: boolean;

  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  updatedAt: Date;
}
