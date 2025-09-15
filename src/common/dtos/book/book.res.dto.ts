import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CategoryResponseDto } from '@src/common/dtos/category';

export class BookResponseDto {
  @ApiProperty({ description: 'Book ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Book thumbnail URL' })
  @Expose()
  thumbnail: string;

  @ApiProperty({ description: 'Book slider images', type: [String] })
  @Expose()
  slider: string[];

  @ApiProperty({ description: 'Main text content' })
  @Expose()
  mainText: string;

  @ApiProperty({ description: 'Author name' })
  @Expose()
  author: string;

  @ApiProperty({ description: 'Book price' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Number of books sold' })
  @Expose()
  sold: number;

  @ApiProperty({ description: 'Available quantity' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Book category', type: CategoryResponseDto })
  @Expose()
  category: CategoryResponseDto;

  @ApiProperty({ description: 'Is active' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
