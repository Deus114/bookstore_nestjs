import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/common/dtos/category';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo category mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo category thành công',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Tạo category thành công')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: IUser,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.create(createCategoryDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật category thành công',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Cập nhật category thành công')
  async update(
    @Param('id') id: EntityId,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa category' })
  @ApiResponse({ status: 200, description: 'Xóa category thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Xóa category thành công')
  async remove(
    @Param('id') id: EntityId,
    @User() user: IUser,
  ): Promise<boolean> {
    return await this.categoriesService.remove(id, user);
  }
}
