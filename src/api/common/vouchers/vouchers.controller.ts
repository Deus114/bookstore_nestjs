import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  ClaimVoucherDto,
  UserVoucherResponseDto,
  VoucherQueryDto,
  VoucherResponseDto,
} from '@src/common/dtos/voucher';
import { IUser } from '@src/common/utils/interfaces';
import { ResponseMessage, User } from '@src/decorator/customize';
import { VouchersService } from './vouchers.service';

@ApiTags('Vouchers')
@Controller()
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách voucher khả dụng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách voucher',
    type: PaginatedResponseDto<VoucherResponseDto>,
  })
  @ResponseMessage('Lấy danh sách voucher thành công')
  async findAll(
    @Query() query: VoucherQueryDto,
  ): Promise<PaginatedResponseDto<VoucherResponseDto>> {
    return this.vouchersService.findAll(
      query.current || 1,
      query.pageSize || 10,
      query.search,
      query.type,
      query.discountType,
    );
  }

  @Post('/claim')
  @ApiOperation({ summary: 'Người dùng nhận voucher' })
  @ApiResponse({
    status: 200,
    description: 'Nhận voucher thành công',
    type: UserVoucherResponseDto,
  })
  @ResponseMessage('Nhận voucher thành công')
  async claim(
    @Body() claimVoucherDto: ClaimVoucherDto,
    @User() user: IUser,
  ): Promise<UserVoucherResponseDto> {
    return this.vouchersService.claimVoucher(claimVoucherDto, user);
  }

  @Get('/my')
  @ApiOperation({ summary: 'Danh sách voucher của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách voucher của người dùng',
    type: [UserVoucherResponseDto],
  })
  @ResponseMessage('Lấy voucher của người dùng thành công')
  async getMyVouchers(@User() user: IUser): Promise<UserVoucherResponseDto[]> {
    return this.vouchersService.getUserVouchers(user);
  }
}
