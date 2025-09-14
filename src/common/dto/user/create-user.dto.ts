import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../utils/enums';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ enum: UserRole })
  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsEnum(UserRole, { message: 'Role không hợp lệ' })
  role: UserRole;
}
