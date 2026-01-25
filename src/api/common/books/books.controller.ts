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
  @ResponseMessage('BOOK_LIST_SUCCESS')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    return await this.booksService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      paginationQuery.search,
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
  @ResponseMessage('BOOK_GET_SUCCESS')
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return await this.booksService.findOne(id as EntityId);
  }
}
