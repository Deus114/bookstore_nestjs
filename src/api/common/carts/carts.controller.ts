import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from '@src/decorator/customize';
import { IUser } from '@src/common/utils/interfaces';
import {
  AddProductToCartDto,
  UpdateCartItemQuantityDto,
  CartResponseDto,
} from '@src/common/dtos/cart';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import { CartsService } from './carts.service';
import { EntityId } from '@src/common/utils/types';

@ApiTags('Carts')
@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin giỏ hàng thành công',
    type: PaginatedResponseDto<CartResponseDto>,
  })
  @ResponseMessage('Lấy thông tin giỏ hàng thành công')
  async getCart(
    @User() user: IUser,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<CartResponseDto>> {
    return await this.cartsService.getCart(
      user,
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
    );
  }

  @Post('add-product')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Thêm sản phẩm vào giỏ hàng thành công',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ResponseMessage('Thêm sản phẩm vào giỏ hàng thành công')
  async addProduct(
    @Body() addProductDto: AddProductToCartDto,
    @User() user: IUser,
  ): Promise<CartResponseDto> {
    return await this.cartsService.addProduct(user, addProductDto);
  }

  @Put('items/:id/quantity')
  @ApiOperation({ summary: 'Tăng/giảm số lượng sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật số lượng thành công',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cart item' })
  @ResponseMessage('Cập nhật số lượng thành công')
  async updateQuantity(
    @Param('id') itemId: EntityId,
    @Body() updateQuantityDto: UpdateCartItemQuantityDto,
    @User() user: IUser,
  ): Promise<CartResponseDto> {
    return await this.cartsService.updateQuantity(
      user,
      itemId,
      updateQuantityDto,
    );
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cart item' })
  @ResponseMessage('Xóa sản phẩm khỏi giỏ hàng thành công')
  async deleteItem(
    @Param('id') itemId: EntityId,
    @User() user: IUser,
  ): Promise<CartResponseDto> {
    return await this.cartsService.deleteItem(user, itemId);
  }
}
