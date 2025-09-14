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
import { ResponseMessage, User } from '@src/decorator/customize';
import {
  ChangePassWorDto,
  CreateUserDto,
  UpdateUserDto,
} from '@src/common/dto/user';
import { IUser } from '@src/common/utils/interfaces';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Tạo mới người dùng thành công')
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return await this.usersService.create(createUserDto, user);
  }

  @ResponseMessage('Tạo mới nhiều người dùng thành công')
  @Post('/bulk-create')
  async bulkCreate(
    @Body() createUserDto: CreateUserDto[],
    @User() user: IUser,
  ) {
    return await this.usersService.bulkCreate(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Lấy dữ liệu thành công')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.usersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @Put()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @ResponseMessage('Xóa người dùng thành công')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
  }

  @ResponseMessage('Cập nhật mật khẩu thành công')
  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePassWorDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }
}
