import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityId } from '@src/common/utils/types';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'ID category' })
  @IsNotEmpty({ message: 'ID category không được để trống' })
  id: EntityId;

  @ApiProperty({ description: 'Tên category tiếng Việt' })
  @IsOptional()
  @IsString()
  titleVi?: string;

  @ApiProperty({ description: 'Mô tả category tiếng Việt' })
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiProperty({ description: 'Tên category tiếng Anh' })
  @IsOptional()
  @IsString()
  titleEn?: string;

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
