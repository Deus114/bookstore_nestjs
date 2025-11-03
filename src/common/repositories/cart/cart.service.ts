import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@src/common/entities';
import { Repository } from 'typeorm';
import { EntityId, Relation } from '@src/common/utils/types';

@Injectable()
export class CartRepositoryService {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  async findOneByUserId(
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<Cart | null> {
    return await this.repository.findOne({
      where: { user: { id: userId } },
      relations,
    });
  }

  async findOrCreateByUserId(
    userId: EntityId,
    relations: Relation[] = [],
  ): Promise<Cart> {
    let cart = await this.findOneByUserId(userId, relations);
    if (!cart) {
      cart = this.repository.create({
        user: { id: userId } as any,
        totalAmount: 0,
        totalItems: 0,
      });
      cart.createdAt = cart.generateDateNow();
      cart.updatedAt = cart.generateDateNow();
      cart = await this.repository.save(cart);
      // Reload with relations
      cart = await this.findOneByUserId(userId, relations);
    }
    return cart;
  }

  async save(cart: Cart): Promise<Cart> {
    cart.updatedAt = cart.generateDateNow();
    return await this.repository.save(cart);
  }
}
