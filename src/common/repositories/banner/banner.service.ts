import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class BannerRepositoryService {
  constructor(
    @InjectRepository(Banner)
    private readonly repository: Repository<Banner>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Banner> {
    return this.repository.createQueryBuilder('banner');
  }

  async findOne(id: EntityId, relations: Relation[] = []): Promise<Banner> {
    if (!id) return null;
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneOrFail(
    id: EntityId,
    relations: Relation[] = [],
  ): Promise<Banner> {
    const result = await this.findOne(id, relations);
    if (!result) {
      throw new NotFoundException({
        errorCode: 'BANNER_NOT_FOUND',
      });
    }
    return result;
  }

  async findAll(): Promise<Banner[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async create(banner: Banner): Promise<Banner> {
    banner.createdAt = banner.generateDateNow();
    banner.updatedAt = banner.generateDateNow();

    return await this.repository.save(banner);
  }

  async update(banner: Banner): Promise<Banner> {
    banner.updatedAt = banner.generateDateNow();

    return await this.repository.save(banner);
  }

  async updateById(id: EntityId, updateData: Partial<Banner>): Promise<void> {
    await this.repository.update(id, updateData);
  }

  async softDelete(id: EntityId, deletedBy?: string): Promise<void> {
    if (deletedBy) {
      await this.repository.update(id, { deletedBy });
    }
    await this.repository.softDelete(id);
  }

  async count(where?: any): Promise<number> {
    return await this.repository.count({ where });
  }
}
