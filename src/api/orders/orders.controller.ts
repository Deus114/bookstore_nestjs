import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from '@src/decorator/customize';
import { CreateOrderDto } from '@src/common/dto/order';
import { IUser } from '@src/common/utils/interfaces';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.ordersService.findAll(+currentPage, +limit, qs);
  }
}

@Controller('history')
export class OrderHistory {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrderHistory(@User() user: IUser) {
    return await this.ordersService.getHistory(user);
  }
}
