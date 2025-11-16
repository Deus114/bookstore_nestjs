import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVoucher } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserVoucherRepositoryService {
  constructor(
    @InjectRepository(UserVoucher)
    private readonly repository: Repository<UserVoucher>,
  ) {}

  async findOne(
    id: EntityId,
    relations: Relation[] = [],
  ): Promise<UserVoucher | null> {
    if (!id) return null;
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByVoucherAndUser(
    voucherId: EntityId,
    userId: EntityId,
  ): Promise<UserVoucher | null> {
    if (!voucherId || !userId) return null;
    return this.repository.findOne({
      where: {
        voucher: { id: voucherId },
        user: { id: userId },
      },
      relations: ['voucher', 'user'],
    });
  }

  async findByUser(
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<UserVoucher[]> {
    if (!userId) return [];
    return this.repository.find({
      where: { user: { id: userId } },
      relations,
    });
  }

  async create(userVoucher: UserVoucher): Promise<UserVoucher> {
    userVoucher.createdAt = userVoucher.generateDateNow();
    userVoucher.updatedAt = userVoucher.generateDateNow();
    return this.repository.save(userVoucher);
  }

  async update(userVoucher: UserVoucher): Promise<UserVoucher> {
    userVoucher.updatedAt = userVoucher.generateDateNow();
    return this.repository.save(userVoucher);
  }
}
