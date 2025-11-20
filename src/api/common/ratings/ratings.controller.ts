import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  CreateRatingDto,
  RatingQueryDto,
  RatingResponseDto,
  UpdateRatingDto,
} from '@src/common/dtos/rating';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { RatingsService } from './ratings.service';

@ApiTags('Ratings')
@Controller()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới đánh giá sản phẩm' })
  @ApiResponse({
    status: 201,
    description: 'Tạo đánh giá thành công',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sách' })
  @ApiResponse({
    status: 400,
    description: 'Bạn đã đánh giá sản phẩm này rồi',
  })
  @ResponseMessage('Tạo đánh giá thành công')
  async create(
    @Body() createRatingDto: CreateRatingDto,
    @User() user: IUser,
  ): Promise<RatingResponseDto> {
    return await this.ratingsService.create(createRatingDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả đánh giá với filter và phân trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đánh giá',
    type: PaginatedResponseDto<RatingResponseDto>,
  })
  @ResponseMessage('Lấy danh sách đánh giá thành công')
  async findAll(
    @Query() ratingQuery: RatingQueryDto,
  ): Promise<PaginatedResponseDto<RatingResponseDto>> {
    return await this.ratingsService.findAll(
      ratingQuery.current || 1,
      ratingQuery.pageSize || 10,
      ratingQuery.rating,
      ratingQuery.comment,
    );
  }

  @Get('book/:bookId')
  @ApiOperation({
    summary: 'Lấy danh sách đánh giá theo sách với filter và phân trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đánh giá',
    type: PaginatedResponseDto<RatingResponseDto>,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sách' })
  @ResponseMessage('Lấy danh sách đánh giá thành công')
  async findAllByBook(
    @Param('bookId') bookId: EntityId,
    @Query() ratingQuery: RatingQueryDto,
  ): Promise<PaginatedResponseDto<RatingResponseDto>> {
    return await this.ratingsService.findAllByBook(
      bookId,
      ratingQuery.current || 1,
      ratingQuery.pageSize || 10,
      ratingQuery.rating,
      ratingQuery.comment,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đánh giá',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đánh giá' })
  @ResponseMessage('Lấy thông tin đánh giá thành công')
  async findOne(@Param('id') id: EntityId): Promise<RatingResponseDto> {
    return await this.ratingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật đánh giá thành công',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đánh giá' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật đánh giá này',
  })
  @ResponseMessage('Cập nhật đánh giá thành công')
  async update(
    @Param('id') id: EntityId,
    @Body() updateRatingDto: UpdateRatingDto,
    @User() user: IUser,
  ): Promise<RatingResponseDto> {
    return await this.ratingsService.update(id, updateRatingDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Xóa đánh giá thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đánh giá' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xóa đánh giá này',
  })
  @ResponseMessage('Xóa đánh giá thành công')
  async delete(@Param('id') id: EntityId, @User() user: IUser): Promise<void> {
    return await this.ratingsService.delete(id, user);
  }
}
