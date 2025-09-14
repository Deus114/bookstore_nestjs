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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '@src/api/auth/jwt-auth.guard';
import { Public } from '@src/decorator/customize';
import { ResponseMessage } from '@src/decorator/customize';
import { IUser } from '@src/common/utils/interfaces';
import { Relation } from '@src/common/utils/types';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategoryListResponseDto,
} from '@src/common/dto/category';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private i18nService: I18nService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả categories' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách categories thành công',
    type: CategoryListResponseDto,
  })
  @ResponseMessage('Lấy danh sách thể loại thành công')
  async findAll(
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryListResponseDto> {
    const data = await this.categoriesService.findAll(language);
    const message = await this.i18nService.translate('category.get_success', {
      lang: language,
    });
    return {
      data,
      message,
      total: data.length,
    };
  }

  @Public()
  @Get('/simple')
  @ApiOperation({ summary: 'Lấy danh sách categories đơn giản' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách categories đơn giản thành công',
    type: CategoryListResponseDto,
  })
  @ResponseMessage('Lấy danh sách thể loại đơn giản thành công')
  async findAllSimple(
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryListResponseDto> {
    const data = await this.categoriesService.findAllSimple(language);
    const message = await this.i18nService.translate(
      'category.get_simple_success',
      {
        lang: language,
      },
    );
    return {
      data,
      message,
      total: data.length,
    };
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Lấy thông tin category theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin category thành công',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Lấy thông tin thể loại thành công')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.findOne(id, language);
  }

  @Public()
  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin category theo slug' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin category thành công',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Lấy thông tin thể loại thành công')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('lang') language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.findBySlug(slug, language);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo category mới' })
  @ApiResponse({ status: 201, description: 'Tạo category thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Tạo thể loại thành công')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Query('lang') language: string = 'vi',
    @Query('user') user: IUser,
  ): Promise<{ id: string; createdAt: Date; message: string }> {
    const result = await this.categoriesService.create(
      createCategoryDto,
      user,
      language,
    );
    const message = await this.i18nService.translate(
      'category.create_success',
      {
        lang: language,
      },
    );
    return {
      ...result,
      message,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiResponse({ status: 200, description: 'Cập nhật category thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Cập nhật thể loại thành công')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Query('lang') language: string = 'vi',
    @Query('user') user: IUser,
  ): Promise<{ message: string }> {
    await this.categoriesService.update(id, updateCategoryDto, user, language);
    const message = await this.i18nService.translate(
      'category.update_success',
      {
        lang: language,
      },
    );
    return {
      message,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa category' })
  @ApiResponse({ status: 200, description: 'Xóa category thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy category' })
  @ResponseMessage('Xóa thể loại thành công')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') language: string = 'vi',
    @Query('user') user: IUser,
  ): Promise<{ message: string }> {
    await this.categoriesService.remove(id, user, language);
    const message = await this.i18nService.translate(
      'category.delete_success',
      {
        lang: language,
      },
    );
    return {
      message,
    };
  }

  @Public()
  @Get('/query/custom')
  @ApiOperation({ summary: 'Lấy danh sách categories với custom query' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách categories thành công',
    type: CategoryListResponseDto,
  })
  @ResponseMessage('Lấy danh sách thể loại với custom query thành công')
  async findWithCustomQuery(
    @Query('lang') language: string = 'vi',
    @Query('isActive') isActive?: boolean,
    @Query('sortOrder') sortOrder?: number,
    @Query('relations') relations?: string,
  ): Promise<CategoryListResponseDto> {
    const conditions: any = {};

    if (isActive !== undefined) {
      conditions['category.isActive'] = isActive;
    }

    if (sortOrder !== undefined) {
      conditions['category.sortOrder'] = sortOrder;
    }

    const relationsArray = relations
      ? (relations.split(',') as Relation[])
      : [];

    const data = await this.categoriesService.findWithCustomQuery(
      conditions,
      language,
      relationsArray,
    );

    const message = await this.i18nService.translate(
      'category.get_custom_query_success',
      {
        lang: language,
      },
    );

    return {
      data,
      message,
      total: data.length,
    };
  }

  @Public()
  @Get('/query/builder')
  @ApiOperation({ summary: 'Lấy query builder cho custom queries' })
  @ApiResponse({
    status: 200,
    description: 'Query builder sẵn sàng sử dụng',
  })
  @ResponseMessage('Query builder sẵn sàng sử dụng')
  async getQueryBuilder(@Query('lang') language: string = 'vi') {
    const queryBuilder = this.categoriesService.getQueryBuilder();

    // Ví dụ sử dụng query builder
    const example = queryBuilder
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('category.sortOrder', 'ASC')
      .getQuery();

    const message = await this.i18nService.translate(
      'category.query_builder_ready',
      {
        lang: language,
      },
    );

    return {
      message,
      exampleQuery: example,
      availableMethods: [
        'where()',
        'andWhere()',
        'orWhere()',
        'orderBy()',
        'addOrderBy()',
        'limit()',
        'offset()',
        'leftJoin()',
        'leftJoinAndSelect()',
        'leftJoinAndMapOne()',
        'select()',
        'addSelect()',
        'getOne()',
        'getMany()',
        'getRawAndEntities()',
        'getCount()',
      ],
    };
  }
}
