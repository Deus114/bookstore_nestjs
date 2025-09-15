import { Injectable } from '@nestjs/common';
import { BookResource, BooksResource } from '@src/common/resources';
import {
  CreateBookDto,
  UpdateBookDto,
  BookResponseDto,
} from '@src/common/dtos/book';
import { CreateResponseDto } from '@src/common/dtos/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { Book } from '@src/common/entities';
import { BookRepositoryService } from '@src/common/repositories/book';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { IUser } from '@src/common/utils/interfaces';
import aqp from 'api-query-params';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class BooksService {
  constructor(
    private bookRepositoryService: BookRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
  ) {}

  async create(
    createBookDto: CreateBookDto,
    i_user: IUser,
  ): Promise<CreateResponseDto> {
    // Lấy category trước
    const category = await this.categoryRepositoryService.findOne(
      createBookDto.category,
    );
    if (!category) {
      throw new Error('Category not found');
    }

    const book = new Book();
    book.thumbnail = createBookDto.thumbnail;
    book.slider = createBookDto.slider;
    book.mainText = createBookDto.mainText;
    book.author = createBookDto.author;
    book.price = createBookDto.price;
    book.quantity = createBookDto.quantity;
    book.category = category;
    book.sold = 0;
    book.createdBy = i_user.id;

    const result = await this.bookRepositoryService.create(book);
    return {
      id: result.id,
      createdAt: result.createdAt,
    };
  }

  async findAll(
    currentPage: number,
    limit: number,
    qs: string,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const queryBuilder = this.bookRepositoryService.getQueryBuilder();

    // Apply filters
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        queryBuilder.andWhere(`book.${key} = :${key}`, { [key]: filter[key] });
      }
    });

    // Apply sorting
    if (sort) {
      Object.keys(sort).forEach((key) => {
        queryBuilder.addOrderBy(
          `book.${key}`,
          sort[key] === 1 ? 'ASC' : 'DESC',
        );
      });
    }

    const totalItems = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await queryBuilder.skip(offset).take(defaultLimit).getMany();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: BooksResource(result),
    };
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

  async update(
    id: EntityId,
    updateBookDto: UpdateBookDto,
    user: IUser,
  ): Promise<BookResponseDto> {
    // Lấy category trước nếu có thay đổi
    let category = null;
    if (updateBookDto.category) {
      category = await this.categoryRepositoryService.findOne(
        updateBookDto.category,
      );
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const updateData: any = {
      thumbnail: updateBookDto.thumbnail,
      slider: updateBookDto.slider,
      mainText: updateBookDto.mainText,
      author: updateBookDto.author,
      price: updateBookDto.price,
      quantity: updateBookDto.quantity,
      updatedBy: user.id,
    };

    if (category) {
      updateData.category = category;
    }

    await this.bookRepositoryService.updateById(id, updateData);
    const updatedBook = await this.bookRepositoryService.findOne(
      id as EntityId,
      ['category'],
    );
    return BookResource(updatedBook);
  }

  async remove(id: EntityId): Promise<void> {
    await this.bookRepositoryService.delete(id as EntityId);
  }

  getBookDashboard = async (): Promise<number> => {
    const count = await this.bookRepositoryService.count();
    return count;
  };
}
