import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EntityId } from '@src/common/utils/types';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID category' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Tên category' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Mô tả category' })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Slug category' })
  @Expose()
  slug?: string;

  @ApiProperty({ description: 'Icon category' })
  @Expose()
  icon?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @Expose()
  sortOrder: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Ngày tạo' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @Expose()
  updatedAt: Date;
}
