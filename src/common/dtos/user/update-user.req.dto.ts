import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Gender } from '@src/common/utils/enums';

export class UpdateUserDto {
  @ApiProperty({ description: 'Tên đầy đủ', required: false })
  @IsOptional()
  @ValidateIf((o) => o.fullName !== undefined)
  @IsString({ message: 'Tên phải là chuỗi' })
  fullName?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @ValidateIf((o) => o.phone !== undefined)
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @ApiProperty({ description: 'URL ảnh đại diện', required: false })
  @IsOptional()
  @ValidateIf((o) => o.avatar !== undefined)
  @IsString({ message: 'Avatar phải là chuỗi' })
  avatar?: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.gender !== undefined)
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
