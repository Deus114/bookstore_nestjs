import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Thumbnail không được để trống' })
  thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  slider?: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên sách không được để trống' })
  mainText: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên tác giả không được để trống' })
  author: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  price: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Thể loại không được để trống' })
  category: string;
}
