import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
  VoucherResponseDto,
} from '@src/common/dtos/voucher';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { VouchersService } from './vouchers.service';

@ApiTags('Vouchers')
@Controller()
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới voucher' })
  @ApiResponse({
    status: 201,
    description: 'Tạo mới voucher thành công',
    type: VoucherResponseDto,
  })
  @ResponseMessage('VOUCHER_CREATE_SUCCESS')
  async create(
    @Body() createVoucherDto: CreateVoucherDto,
    @User() user: IUser,
  ): Promise<VoucherResponseDto> {
    return this.vouchersService.create(createVoucherDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật voucher' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật voucher thành công',
    type: VoucherResponseDto,
  })
  @ResponseMessage('VOUCHER_UPDATE_SUCCESS')
  async update(
    @Param('id') id: EntityId,
    @Body() updateVoucherDto: UpdateVoucherDto,
    @User() user: IUser,
  ): Promise<VoucherResponseDto> {
    return this.vouchersService.update(id, updateVoucherDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa voucher' })
  @ApiResponse({
    status: 200,
    description: 'Xóa voucher thành công',
    type: Boolean,
  })
  @ResponseMessage('VOUCHER_DELETE_SUCCESS')
  async remove(@Param('id') id: EntityId): Promise<boolean> {
    return this.vouchersService.remove(id);
  }
}
