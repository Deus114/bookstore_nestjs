import { Injectable } from '@nestjs/common';
import {
  BookResponseDto,
  CreateBookDto,
  UpdateBookDto,
} from '@src/common/dtos/book';
import { CategoryResponseDto } from '@src/common/dtos/category';
import { Book, Category } from '@src/common/entities';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import { BookRepositoryService } from '@src/common/repositories/book';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { ContentLanguageRepositoryService } from '@src/common/repositories/content-language';
import { BookResource, CategoryResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class BooksService {
  constructor(
    private bookRepositoryService: BookRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
    private contentLanguageRepositoryService: ContentLanguageRepositoryService,
  ) {}

  async create(
    createBookDto: CreateBookDto,
    i_user: IUser,
  ): Promise<BookResponseDto> {
    // Lấy category trước
    const category = await this.categoryRepositoryService.findOne(
      createBookDto.category,
    );
    if (!category) {
      throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
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
    const savedBook = await this.bookRepositoryService.findOne(result.id, [
      'category',
    ]);

    // Load category với translations
    const categoryDto = savedBook.category
      ? await this.loadCategoryWithTranslations(savedBook.category, 'vi')
      : null;

    return BookResource(savedBook, categoryDto);
  }

  private async loadCategoryWithTranslations(
    category: Category,
    language: string = 'vi',
  ): Promise<CategoryResponseDto | null> {
    const nameTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.nameKey,
        language,
      );
    const descriptionTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.descriptionKey,
        language,
      );

    return CategoryResource(category, nameTranslation, descriptionTranslation);
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
        throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
      }
    }

    const book = await this.bookRepositoryService.findOne(id, ['category']);
    if (!book) {
      throw new NotFoundBusinessException('BOOK_NOT_FOUND');
    }

    if (updateBookDto.thumbnail) {
      book.thumbnail = updateBookDto.thumbnail;
    }
    if (updateBookDto.slider) {
      book.slider = updateBookDto.slider;
    }
    if (updateBookDto.mainText) {
      book.mainText = updateBookDto.mainText;
    }
    if (updateBookDto.author) {
      book.author = updateBookDto.author;
    }
    if (updateBookDto.price) {
      book.price = updateBookDto.price;
    }
    if (updateBookDto.quantity) {
      book.quantity = updateBookDto.quantity;
    }
    if (category) {
      book.category = category;
    }
    if (user.id) {
      book.updatedBy = user.id;
    }

    const updatedBook = await this.bookRepositoryService.update(book);

    // Reload book với category
    const finalBook = await this.bookRepositoryService.findOne(updatedBook.id, [
      'category',
    ]);

    if (!finalBook) {
      throw new NotFoundBusinessException('BOOK_NOT_FOUND');
    }

    // Load category với translations
    const categoryDto = finalBook.category
      ? await this.loadCategoryWithTranslations(finalBook.category, 'vi')
      : null;

    return BookResource(finalBook, categoryDto);
  }

  async remove(id: EntityId): Promise<boolean> {
    await this.bookRepositoryService.delete(id as EntityId);
    return true;
  }

  getBookDashboard = async (): Promise<number> => {
    const count = await this.bookRepositoryService.count();
    return count;
  };
}
