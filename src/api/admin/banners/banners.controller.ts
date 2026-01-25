import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BannerResponseDto,
  CreateBannerDto,
  UpdateBannerDto,
} from '@src/common/dtos/banner';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { BannersService } from './banners.service';

@ApiTags('Banners')
@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo banner mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo banner thành công',
    type: BannerResponseDto,
  })
  @ResponseMessage('BANNER_CREATE_SUCCESS')
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @User() user: IUser,
  ): Promise<BannerResponseDto> {
    return await this.bannersService.create(createBannerDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật banner' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật banner thành công',
    type: BannerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy banner' })
  @ResponseMessage('BANNER_UPDATE_SUCCESS')
  async update(
    @Param('id') id: EntityId,
    @Body() updateBannerDto: UpdateBannerDto,
    @User() user: IUser,
  ): Promise<BannerResponseDto> {
    return await this.bannersService.update(id, updateBannerDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa banner' })
  @ApiResponse({
    status: 200,
    description: 'Xóa banner thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy banner' })
  @ResponseMessage('BANNER_DELETE_SUCCESS')
  async remove(
    @Param('id') id: EntityId,
    @User() user: IUser,
  ): Promise<boolean> {
    return await this.bannersService.remove(id, user);
  }
}
