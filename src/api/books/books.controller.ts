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
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from '@src/common/dto/book';
import { Public, ResponseMessage, User } from '@src/decorator/customize';
import { IUser } from '@src/common/utils/interfaces';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ResponseMessage('Tạo mới sách thành công')
  @Post()
  async create(@Body() createBookDto: CreateBookDto, @User() user: IUser) {
    return await this.booksService.create(createBookDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy dữ liệu thành công')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.booksService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser,
  ) {
    return await this.booksService.update(id, updateBookDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.booksService.remove(id);
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
  async getDashboard() {
    const countUser = await this.usersService.getUserDashboard();
    const countBook = await this.booksService.getBookDashboard();
    const countOrder = await this.ordersService.getOrderDashboard();
    return {
      countUser,
      countBook,
      countOrder,
    };
  }
}
