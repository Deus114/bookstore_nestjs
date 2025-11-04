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
    search?: string,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    const queryBuilder = this.bookRepositoryService.getQueryBuilder();

    if (search) {
      queryBuilder.andWhere(
        `(unaccent(book.mainText) ILIKE :query
        OR unaccent(book.author) ILIKE :query)`,
        {
          query: '%' + search + '%',
        },
      );
    }

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
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
