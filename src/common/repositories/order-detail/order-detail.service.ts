import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '@src/common/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class OrderDetailRepositoryService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly repository: Repository<OrderDetail>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<OrderDetail> {
    return this.repository.createQueryBuilder('orderDetail');
  }

  async findOne(id: string): Promise<OrderDetail> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByOrderId(orderId: string): Promise<OrderDetail[]> {
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
