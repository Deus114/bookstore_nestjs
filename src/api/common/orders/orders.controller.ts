import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import {
  CreateOrderDto,
  OrderResponseDto,
  PreviewOrderResponseDto,
} from '@src/common/dtos/order';
import { IUser } from '@src/common/utils/interfaces';
import { ResponseMessage, User } from '@src/decorator/customize';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('preview')
  @ApiOperation({ summary: 'Xem trước đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin preview đơn hàng thành công',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Lấy thông tin preview đơn hàng thành công')
  async preview(
    @Query() createOrderDto: CreateOrderDto,
    @User() user: IUser,
  ): Promise<PreviewOrderResponseDto> {
    return await this.ordersService.preview(createOrderDto, user);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng' })
  @ApiResponse({
    status: 201,
    description: 'Tạo đơn hàng thành công',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Tạo đơn hàng thành công')
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @User() user: IUser,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách đơn hàng thành công',
    type: PaginatedResponseDto<OrderResponseDto>,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Lấy danh sách đơn hàng thành công')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() qs: string,
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    return await this.ordersService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      qs,
    );
  }
}

@ApiTags('Orders')
@Controller()
export class OrderHistory {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy lịch sử đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy lịch sử đơn hàng thành công',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Lấy lịch sử đơn hàng thành công')
  async getOrderHistory(@User() user: IUser): Promise<OrderResponseDto[]> {
    return await this.ordersService.getHistory(user);
  }
}
