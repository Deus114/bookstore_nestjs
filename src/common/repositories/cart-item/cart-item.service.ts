import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '@src/common/entities';
import { Repository } from 'typeorm';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class CartItemRepositoryService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async findOne(
    id: EntityId,
    relations: string[] = [],
  ): Promise<CartItem | null> {
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByCartId(
    cartId: EntityId,
    relations: string[] = [],
  ): Promise<CartItem[]> {
    return await this.repository.find({
      where: { cart: { id: cartId } },
      relations,
    });
  }

  async findByIds(
    ids: EntityId[],
    cartId: EntityId,
    relations: string[] = [],
  ): Promise<CartItem[]> {
    return await this.repository.find({
      where: ids.map((id) => ({ id, cart: { id: cartId } })),
      relations,
    });
  }

  async create(cartItem: CartItem): Promise<CartItem> {
    cartItem.createdAt = cartItem.generateDateNow();
    cartItem.updatedAt = cartItem.generateDateNow();
    return await this.repository.save(cartItem);
  }

  async update(cartItem: CartItem): Promise<CartItem> {
    cartItem.updatedAt = cartItem.generateDateNow();
    return await this.repository.save(cartItem);
  }

  async delete(id: EntityId): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteMany(ids: EntityId[]): Promise<void> {
    if (ids.length > 0) {
      await this.repository.delete(ids);
    }
  }
}
