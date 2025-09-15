import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: PaginationMetaDto })
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @ApiProperty({ isArray: true })
  @IsArray()
  result: T[];
}
