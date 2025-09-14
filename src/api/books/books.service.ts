import { Injectable } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from '@src/common/dto/book';
import { Book } from '@src/common/entities';
import { BookRepositoryService } from '@src/common/repositories/book';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { IUser } from '@src/common/utils/interfaces';
import aqp from 'api-query-params';

@Injectable()
export class BooksService {
  constructor(
    private bookRepositoryService: BookRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
  ) {}

  async create(createBookDto: CreateBookDto, i_user: IUser) {
    // Lấy category trước
    const category = await this.categoryRepositoryService.findOne(
      createBookDto.category,
    );
    if (!category) {
      throw new Error('Category not found');
    }

    let book = await this.bookRepositoryService.create({
      thumbnail: createBookDto.thumbnail,
      slider: createBookDto.slider,
      mainText: createBookDto.mainText,
      author: createBookDto.author,
      price: createBookDto.price,
      quantity: createBookDto.quantity,
      category: category,
      sold: 0,
      createdBy: i_user.id,
    } as Book);
    return {
      id: book.id,
      createdAt: book.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

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
      result,
    };
  }

  async findOne(id: string, relations: string[] = []) {
    return await this.bookRepositoryService.findOne(id, relations as any);
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: IUser) {
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

    return await this.bookRepositoryService.updateById(id, updateData);
  }

  async remove(id: string) {
    return await this.bookRepositoryService.delete(id);
  }

  getBookDashboard = async () => {
    const count = await this.bookRepositoryService.count();
    return count;
  };
}
