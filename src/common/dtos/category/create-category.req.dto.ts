import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên category tiếng Việt' })
  @IsNotEmpty({ message: 'Tên category tiếng Việt không được để trống' })
  @IsString()
  titleVi: string;

  @ApiProperty({ description: 'Mô tả category tiếng Việt' })
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiProperty({ description: 'Tên category tiếng Anh' })
  @IsNotEmpty({ message: 'Tên category tiếng Anh không được để trống' })
  @IsString()
  titleEn: string;

  @ApiProperty({ description: 'Mô tả category tiếng Anh' })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({ description: 'Slug category' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Icon category' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @IsOptional()
  sortOrder?: number;
}
