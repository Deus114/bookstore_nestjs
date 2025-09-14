import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên category (tiếng Việt)' })
  @IsNotEmpty({ message: 'Tên category tiếng Việt không được để trống' })
  @IsString()
  nameVi: string;

  @ApiProperty({ description: 'Tên category (tiếng Anh)' })
  @IsNotEmpty({ message: 'Tên category tiếng Anh không được để trống' })
  @IsString()
  nameEn: string;

  @ApiProperty({ description: 'Mô tả category (tiếng Việt)', required: false })
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiProperty({ description: 'Mô tả category (tiếng Anh)', required: false })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({ description: 'URL slug' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Icon URL', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
