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
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
  UserAddressResponseDto,
} from '@src/common/dtos/user-address';
import { UpdateUserDto, UserResponseDto } from '@src/common/dtos/user';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { ResponseMessage, User } from '@src/decorator/customize';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('address')
  @ApiOperation({ summary: 'Lấy danh sách địa chỉ người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách địa chỉ người dùng',
    type: [UserAddressResponseDto],
  })
  @ResponseMessage('Lấy danh sách địa chỉ thành công')
  async findAllAddresses(
    @User() user: IUser,
  ): Promise<UserAddressResponseDto[]> {
    return await this.usersService.findAllAddresses(user);
  }

  @Get('address/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin địa chỉ',
    type: UserAddressResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
  @ResponseMessage('Lấy thông tin địa chỉ thành công')
  async findOneAddress(
    @Param('id') id: EntityId,
    @User() user: IUser,
  ): Promise<UserAddressResponseDto> {
    return await this.usersService.findOneAddress(id, user);
  }

  @Post('address')
  @ApiOperation({ summary: 'Tạo mới địa chỉ người dùng' })
  @ApiResponse({
    status: 201,
    description: 'Tạo địa chỉ thành công',
    type: UserAddressResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({
    status: 400,
    description: 'Đã đạt giới hạn số địa chỉ tối đa (5 địa chỉ)',
  })
  @ResponseMessage('Tạo địa chỉ thành công')
  async createAddress(
    @Body() createUserAddressDto: CreateUserAddressDto,
    @User() user: IUser,
  ): Promise<UserAddressResponseDto> {
    return await this.usersService.createAddress(createUserAddressDto, user);
  }

  @Put('address/:id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật địa chỉ thành công',
    type: UserAddressResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
  @ResponseMessage('Cập nhật địa chỉ thành công')
  async updateAddress(
    @Param('id') id: EntityId,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
    @User() user: IUser,
  ): Promise<UserAddressResponseDto> {
    return await this.usersService.updateAddress(
      id,
      updateUserAddressDto,
      user,
    );
  }

  @Delete('address/:id')
  @ApiOperation({ summary: 'Xóa địa chỉ người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Xóa địa chỉ thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
  @ApiResponse({
    status: 400,
    description: 'Không thể xóa địa chỉ mặc định khi còn địa chỉ khác',
  })
  @ResponseMessage('Xóa địa chỉ thành công')
  async deleteAddress(
    @Param('id') id: EntityId,
    @User() user: IUser,
  ): Promise<void> {
    return await this.usersService.deleteAddress(id, user);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật người dùng thành công',
    type: UserResponseDto,
  })
  @ResponseMessage('Cập nhật người dùng thành công')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(updateUserDto, user);
  }
}
