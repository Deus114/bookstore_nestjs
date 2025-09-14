import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class CategoryRepositoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Category> {
    return this.repository.createQueryBuilder('category');
  }

  async findOne(id: EntityId, relations: Relation[] = []): Promise<Category> {
    if (!id) return null;
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneOrFail(
    id: EntityId,
    relations: Relation[] = [],
  ): Promise<Category> {
    const result = await this.findOne(id, relations);
    if (!result) {
      throw new Error('Category not found');
    }
    return result;
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async create(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async updateById(id: string, updateData: Partial<Category>): Promise<void> {
    await this.repository.update(id, updateData);
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    if (deletedBy) {
      await this.repository.update(id, { deletedBy });
    }
    await this.repository.softDelete(id);
  }

  async count(where?: any): Promise<number> {
    return await this.repository.count({ where });
  }
}
