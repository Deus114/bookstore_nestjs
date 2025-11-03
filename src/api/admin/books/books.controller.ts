import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '@src/api/common/orders/orders.service';
import {
  BookResponseDto,
  CreateBookDto,
  UpdateBookDto,
} from '@src/common/dtos/book';
import { DashboardResponseDto } from '@src/common/dtos/dashboard';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { BooksService } from './books.service';

@ApiTags('Books')
@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Tạo mới sách' })
  @ApiResponse({
    status: 201,
    description: 'Sách đã được tạo thành công',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Tạo mới sách thành công')
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @User() user: IUser,
  ): Promise<BookResponseDto> {
    return await this.booksService.create(createBookDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sách' })
  @ApiResponse({
    status: 200,
    description: 'Sách đã được cập nhật thành công',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Cập nhật sách thành công')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser,
  ) {
    return await this.booksService.update(id as EntityId, updateBookDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sách' })
  @ApiResponse({
    status: 200,
    description: 'Sách đã được xóa thành công',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'Sách không tồn tại' })
  @ResponseMessage('Xóa sách thành công')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.booksService.remove(id as EntityId);
  }
}

@ApiTags('Database')
@Controller()
export class DatabaseController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOperation({ summary: 'Lấy dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard',
    type: DashboardResponseDto,
  })
  @ResponseMessage('Lấy dashboard thành công')
  @Get('/dashboard')
  async getDashboard(): Promise<DashboardResponseDto> {
    const countUser = await this.usersService.getUserDashboard();
    const countBook = await this.booksService.getBookDashboard();
    const countOrder = await this.ordersService.getOrderDashboard();

    const dashboardData = {
      countUser,
      countBook,
      countOrder,
    };

    return plainToClass(DashboardResponseDto, dashboardData, {
      excludeExtraneousValues: true,
    });
  }
}
