import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { EntityId } from '@src/common/utils/types';
import { BooksService } from './books.service';
import {
  CreateBookDto,
  UpdateBookDto,
  BookResponseDto,
} from '@src/common/dtos/book';
import { CreateResponseDto } from '@src/common/dtos/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { DashboardResponseDto } from '@src/common/dtos/dashboard';
import { Public, ResponseMessage, User } from '@src/decorator/customize';
import { IUser } from '@src/common/utils/interfaces';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { plainToClass } from 'class-transformer';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ResponseMessage('Tạo mới sách thành công')
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @User() user: IUser,
  ): Promise<CreateResponseDto> {
    return await this.booksService.create(createBookDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy dữ liệu thành công')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    return await this.booksService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return await this.booksService.findOne(id as EntityId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser,
  ) {
    return await this.booksService.update(id as EntityId, updateBookDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.booksService.remove(id as EntityId);
  }
}

@Controller('database')
export class DatabaseController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @ResponseMessage('Lấy dữ liệu thành công')
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
