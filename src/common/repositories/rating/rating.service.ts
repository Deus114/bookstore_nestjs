import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class RatingRepositoryService {
  constructor(
    @InjectRepository(Rating)
    private readonly repository: Repository<Rating>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Rating> {
    return this.repository.createQueryBuilder('rating');
  }

  async findOne(
    id: EntityId,
    relations: Relation[] = [],
  ): Promise<Rating | null> {
    if (!id) return null;
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByBookId(
    bookId: EntityId,
    relations: Relation[] = [],
  ): Promise<Rating[]> {
    return await this.repository.find({
      where: { book: { id: bookId } },
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<Rating[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findByBookIdAndUserId(
    bookId: EntityId,
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<Rating | null> {
    return await this.repository.findOne({
      where: { book: { id: bookId }, user: { id: userId } },
      relations,
    });
  }

  async create(rating: Rating): Promise<Rating> {
    rating.createdAt = rating.generateDateNow();
    rating.updatedAt = rating.generateDateNow();
    return await this.repository.save(rating);
  }

  async update(rating: Rating): Promise<Rating> {
    rating.updatedAt = rating.generateDateNow();
    return await this.repository.save(rating);
  }

  async delete(id: EntityId): Promise<void> {
    await this.repository.delete(id);
  }
}
