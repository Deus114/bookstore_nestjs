import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<User> {
    return this.repository.createQueryBuilder('user');
  }

  async findOne(id: EntityId, relations: Relation[] = []): Promise<User> {
    if (!id) return null;
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneOrFail(id: EntityId, relations: Relation[] = []): Promise<User> {
    const result = await this.findOne(id, relations);
    if (!result) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
      });
    }
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.repository.findOne({ where: { phone } });
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    return await this.repository.findOne({ where: { refreshToken } });
  }

  async create(user: User): Promise<User> {
    user.createdAt = user.generateDateNow();
    user.updatedAt = user.generateDateNow();

    return await this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    user.updatedAt = user.generateDateNow();

    return await this.repository.save(user);
  }

  async updateById(id: string, updateData: Partial<User>): Promise<void> {
    if (!id) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
      });
    }
    await this.repository.update(id, updateData);
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    if (deletedBy) {
      await this.repository.update(id, { deletedBy, deletedAt: new Date() });
    }
    await this.repository.softDelete(id);
  }

  async count(where?: any): Promise<number> {
    return await this.repository.count({ where });
  }
}
