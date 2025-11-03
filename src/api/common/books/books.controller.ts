import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookResponseDto } from '@src/common/dtos/book';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import { EntityId } from '@src/common/utils/types';
import { Public, ResponseMessage } from '@src/decorator/customize';
import { BooksService } from './books.service';

@ApiTags('Books')
@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sách' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sách',
    type: PaginatedResponseDto<BookResponseDto>,
  })
  @ResponseMessage('Lấy danh sách sách thành công')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() qs: string,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    return await this.booksService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      qs,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sách theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin sách',
    type: BookResponseDto,
  })
  @ResponseMessage('Lấy thông tin sách thành công')
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return await this.booksService.findOne(id as EntityId);
  }
}
