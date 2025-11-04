import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class UpdateBannerDto {
  @ApiProperty({ description: 'Tên banner', required: false })
  @IsOptional()
  @IsString()
  name?: string;

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
