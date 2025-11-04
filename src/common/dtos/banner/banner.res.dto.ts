import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EntityId } from '@src/common/utils/types';

export class BannerResponseDto {
  @ApiProperty({ description: 'ID banner' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Tên banner' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mô tả banner', required: false })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'URL banner', required: false })
  @Expose()
  url?: string;

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
