import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '@src/common/dtos/common';
import {
  ChangePassWorDto,
  CreateUserDto,
  UpdateUserDto,
  UserBulkCreateResponseDto,
  UserResponseDto,
} from '@src/common/dtos/user';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { Public, ResponseMessage, User } from '@src/decorator/customize';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ResponseMessage('Tạo mới người dùng thành công')
  @ApiResponse({
    status: 201,
    description: 'Tạo mới người dùng thành công',
    type: UserResponseDto,
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto, user);
  }

  @ResponseMessage('Tạo mới nhiều người dùng thành công')
  @ApiResponse({
    status: 201,
    description: 'Tạo mới nhiều người dùng thành công',
    type: UserBulkCreateResponseDto,
  })
  @Post('/bulk-create')
  async bulkCreate(
    @Body() createUserDto: CreateUserDto[],
    @User() user: IUser,
  ): Promise<UserBulkCreateResponseDto> {
    return await this.usersService.bulkCreate(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Lấy dữ liệu thành công')
  @ApiResponse({
    status: 200,
    description: 'Lấy dữ liệu thành công',
    type: PaginatedResponseDto<UserResponseDto>,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return await this.usersService.findAll(
      paginationQuery.current || 1,
      paginationQuery.pageSize || 10,
      paginationQuery.search,
    );
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @ApiResponse({
    status: 200,
    description: 'Cập nhật người dùng thành công',
    type: UserResponseDto,
  })
  @Put()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ): Promise<UserResponseDto> {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @ResponseMessage('Xóa người dùng thành công')
  @ApiResponse({
    status: 200,
    description: 'Xóa người dùng thành công',
    type: Boolean,
  })
  @Delete(':id')
  async remove(@Param('id') id: EntityId, @User() user: IUser): Promise<void> {
    return await this.usersService.remove(id, user);
  }

  @ResponseMessage('Cập nhật mật khẩu thành công')
  @ApiResponse({
    status: 200,
    description: 'Cập nhật mật khẩu thành công',
    type: UserResponseDto,
  })
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePassWorDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.changePassword(changePasswordDto);
  }
}
