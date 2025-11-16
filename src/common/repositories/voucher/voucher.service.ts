import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from '@src/common/entities';
import { EntityId, Relation } from '@src/common/utils/types';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class VoucherRepositoryService {
  constructor(
    @InjectRepository(Voucher)
    private readonly repository: Repository<Voucher>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Voucher> {
    return this.repository.createQueryBuilder('voucher');
  }

  async findOne(
    id: EntityId,
    relations: Relation[] = [],
  ): Promise<Voucher | null> {
    if (!id) return null;
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByCode(code: string): Promise<Voucher | null> {
    if (!code) {
      return null;
    }
    return this.repository.findOne({ where: { code } });
  }

  async create(voucher: Voucher): Promise<Voucher> {
    voucher.createdAt = voucher.generateDateNow();
    voucher.updatedAt = voucher.generateDateNow();
    return this.repository.save(voucher);
  }

  async update(voucher: Voucher): Promise<Voucher> {
    voucher.updatedAt = voucher.generateDateNow();
    return this.repository.save(voucher);
  }

  async updateById(
    id: EntityId,
    payload: Partial<Voucher>,
  ): Promise<void> {
    await this.repository.update(id, payload);
  }

  async delete(id: EntityId): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}




