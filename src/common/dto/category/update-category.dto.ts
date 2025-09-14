import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ description: 'Tên category (tiếng Việt)', required: false })
  @IsOptional()
  @IsString()
  nameVi?: string;

  @ApiProperty({ description: 'Tên category (tiếng Anh)', required: false })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty({ description: 'Mô tả category (tiếng Việt)', required: false })
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiProperty({ description: 'Mô tả category (tiếng Anh)', required: false })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({ description: 'URL slug', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Icon URL', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
