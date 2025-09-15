import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from '@src/decorator/customize';
import { CreateOrderDto, OrderResponseDto } from '@src/common/dtos/order';
import { CreateResponseDto } from '@src/common/dtos/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { IUser } from '@src/common/utils/interfaces';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<CreateResponseDto> {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    return await this.ordersService.findAll(+currentPage, +limit, qs);
  }
}

@Controller('history')
export class OrderHistory {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrderHistory(@User() user: IUser): Promise<OrderResponseDto[]> {
    return await this.ordersService.getHistory(user);
  }
}
