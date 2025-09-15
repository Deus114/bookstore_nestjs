import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '@src/common/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class OrderDetailRepositoryService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly repository: Repository<OrderDetail>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<OrderDetail> {
    return this.repository.createQueryBuilder('orderDetail');
  }

  async findOne(id: EntityId): Promise<OrderDetail> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByOrderId(orderId: EntityId): Promise<OrderDetail[]> {
    return await this.repository.find({
      where: { order: { id: orderId } },
      relations: ['order', 'book'],
    });
  }

  async create(orderDetail: OrderDetail): Promise<OrderDetail> {
    orderDetail.createdAt = orderDetail.generateDateNow();
    orderDetail.updatedAt = orderDetail.generateDateNow();

    return await this.repository.save(orderDetail);
  }
}
