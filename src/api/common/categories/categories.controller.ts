import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto } from '@src/common/dtos/category';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import { EntityId } from '@src/common/utils/types';
import { Public, ResponseMessage } from '@src/decorator/customize';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách categories' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách categories',
    type: PaginatedResponseDto<CategoryResponseDto>,
  })
  @ResponseMessage('Lấy danh sách categories thành công')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Req() req: any,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const language = req.language;
    return await this.categoriesService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      language,
      paginationQuery.search,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin category theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin category',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Lấy thông tin category thành công')
  async findOne(
    @Param('id') id: EntityId,
    @Req() req: any,
  ): Promise<CategoryResponseDto> {
    const language = req.language;
    return await this.categoriesService.findOne(id, language);
  }
}
