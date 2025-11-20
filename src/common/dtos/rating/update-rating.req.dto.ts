import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty({
    description: 'Đánh giá (1-5 sao)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.rating !== undefined)
  @IsInt({ message: 'Đánh giá phải là số nguyên' })
  @Min(1, { message: 'Đánh giá phải từ 1 đến 5 sao' })
  @Max(5, { message: 'Đánh giá phải từ 1 đến 5 sao' })
  rating?: number;

  @ApiProperty({ description: 'Bình luận về sản phẩm', required: false })
  @IsOptional()
  @ValidateIf((o) => o.comment !== undefined)
  @IsString({ message: 'Bình luận phải là chuỗi' })
  comment?: string;

  @ApiProperty({
    description: 'Mảng hình ảnh đánh giá',
    type: [String],
    required: false,
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsOptional()
  @ValidateIf((o) => o.images !== undefined)
  @IsArray({ message: 'Hình ảnh phải là mảng' })
  @IsString({
    each: true,
    message: 'Mỗi phần tử trong mảng hình ảnh phải là chuỗi',
  })
  images?: string[];
}
