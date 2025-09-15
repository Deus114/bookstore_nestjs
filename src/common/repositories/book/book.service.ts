import { Injectable } from '@nestjs/common';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class BookRepositoryService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
    private errorMessageService: ErrorMessageService,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Book> {
    return this.repository.createQueryBuilder('book');
  }

  async findOne(id: EntityId, relations: Relation[] = []): Promise<Book> {
    if (!id) return null;
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneOrFail(id: EntityId, relations: Relation[] = []): Promise<Book> {
    const result = await this.findOne(id, relations);
    if (!result) {
      throw new Error(this.errorMessageService.getMessage('BOOK_NOT_FOUND'));
    }
    return result;
  }

  async findByCategory(
    categoryId: EntityId,
    relations: Relation[] = [],
  ): Promise<Book[]> {
    return await this.repository.find({
      where: { category: { id: categoryId } },
      relations: relations as any,
    });
  }

  async create(book: Book): Promise<Book> {
    book.createdAt = book.generateDateNow();
    book.updatedAt = book.generateDateNow();

    return await this.repository.save(book);
  }

  async updateById(id: EntityId, updateData: Partial<Book>): Promise<void> {
    await this.repository.update(id, updateData);
  }

  async delete(id: EntityId): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
