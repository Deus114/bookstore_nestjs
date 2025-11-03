import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from '@src/common/entities';
import { Repository } from 'typeorm';
import { EntityId, Relation } from '@src/common/utils/types';

@Injectable()
export class UserAddressRepositoryService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly repository: Repository<UserAddress>,
  ) {}

  async findOne(
    id: EntityId,
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<UserAddress | null> {
    return await this.repository.findOne({
      where: { id, user: { id: userId } },
      relations,
    });
  }

  async findByUserId(
    userId: EntityId,
    relations: string[] = [],
  ): Promise<UserAddress[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations,
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDefaultAddress(
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<UserAddress | null> {
    return await this.repository.findOne({
      where: { user: { id: userId }, isDefault: true },
      relations,
    });
  }
}
