import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@src/common/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class OrderRepositoryService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Order> {
    return this.repository.createQueryBuilder('order');
  }

  async findOne(id: EntityId): Promise<Order> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: EntityId): Promise<Order[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['user', 'orderDetails'],
    });
  }

  async create(order: Order): Promise<Order> {
    order.createdAt = order.generateDateNow();
    order.updatedAt = order.generateDateNow();

    return await this.repository.save(order);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
