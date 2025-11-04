import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BannerResponseDto } from '@src/common/dtos/banner';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import { EntityId } from '@src/common/utils/types';
import { Public, ResponseMessage } from '@src/decorator/customize';
import { BannersService } from './banners.service';

@ApiTags('Banners')
@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách banners' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách banners',
    type: PaginatedResponseDto<BannerResponseDto>,
  })
  @ResponseMessage('Lấy danh sách banners thành công')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<BannerResponseDto>> {
    return await this.bannersService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      paginationQuery.search,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin banner theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin banner',
    type: BannerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy banner' })
  @ResponseMessage('Lấy thông tin banner thành công')
  async findOne(@Param('id') id: EntityId): Promise<BannerResponseDto> {
    return await this.bannersService.findOne(id);
  }
}
