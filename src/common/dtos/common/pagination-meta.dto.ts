import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Trang hiện tại' })
  current: number;

  @ApiProperty({ description: 'Kích thước trang' })
  pageSize: number;

  @ApiProperty({ description: 'Tổng số trang' })
  pages: number;

  @ApiProperty({ description: 'Tổng số mục' })
  total: number;
}
