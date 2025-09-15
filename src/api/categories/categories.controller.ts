import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EntityId } from '@src/common/utils/types';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResponseMessage, User, Public } from '@src/decorator/customize';
import { JwtAuthGuard } from '@src/api/auth/jwt-auth.guard';
import { IUser } from '@src/common/utils/interfaces';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '@src/common/dtos/category';
import { CreateResponseDto } from '@src/common/dtos/common';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả categories' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách categories',
    type: [CategoryResponseDto],
  })
  @ResponseMessage('Lấy danh sách categories thành công')
  async findAll(
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryResponseDto[]> {
    return await this.categoriesService.findAll(language);
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
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.findOne(id as EntityId, language);
  }

  @Public()
  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin category theo slug' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin category',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Lấy thông tin category thành công')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.findBySlug(slug, language);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo category mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo category thành công',
    type: CreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Tạo category thành công')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: IUser,
    @Query('lang') language: string = 'vi',
  ): Promise<CreateResponseDto> {
    return await this.categoriesService.create(createCategoryDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiResponse({ status: 200, description: 'Cập nhật category thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Cập nhật category thành công')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser,
    @Query('lang') language: string = 'vi',
  ): Promise<{ message: string }> {
    await this.categoriesService.update(
      id as EntityId,
      updateCategoryDto,
      user,
    );
    const message = this.errorMessageService.getSuccessMessage(
      'category.update.success',
      language,
    );
    return { message };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa category' })
  @ApiResponse({ status: 200, description: 'Xóa category thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Xóa category thành công')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: IUser,
    @Query('lang') language: string = 'vi',
  ): Promise<{ message: string }> {
    await this.categoriesService.remove(id as EntityId, user);
    const message = this.errorMessageService.getSuccessMessage(
      'category.delete.success',
      language,
    );
    return { message };
  }
}
