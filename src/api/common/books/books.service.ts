import { Injectable } from '@nestjs/common';
import { BookResponseDto } from '@src/common/dtos/book';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { BookRepositoryService } from '@src/common/repositories/book';
import { BookResource, BooksResource } from '@src/common/resources';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class BooksService {
  constructor(private bookRepositoryService: BookRepositoryService) {}

  async findAll(
    currentPage: number,
    limit: number,
    qs: string,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    const queryBuilder = this.bookRepositoryService.getQueryBuilder();

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
      qs,
      alias: 'book',
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      BooksResource(result),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findOne(
    id: EntityId,
    relations: string[] = [],
  ): Promise<BookResponseDto> {
    const book = await this.bookRepositoryService.findOne(
      id as EntityId,
      relations as any,
    );
    return BookResource(book);
  }
}
