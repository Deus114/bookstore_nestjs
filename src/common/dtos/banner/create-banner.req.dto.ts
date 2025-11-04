import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ description: 'Tên banner' })
  @IsNotEmpty({ message: 'Tên banner không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả banner', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL banner', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', required: false })
  @IsOptional()
  @IsInt()
  @IsNumber()
  sortOrder?: number;
}
