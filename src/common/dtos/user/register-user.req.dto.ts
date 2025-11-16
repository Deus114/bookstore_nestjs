import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Gender } from '@src/common/utils/enums';

export class RegisterUserDto {
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

  @ApiProperty({ description: 'Giới tính', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;

  @ApiProperty({
    description: 'Ngày sinh',
    type: 'string',
    format: 'date',
    required: false,
    example: '2000-01-01',
  })
  @IsOptional()
  @ValidateIf((o) => o.dob !== undefined)
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  dob?: Date;
}
