import { Injectable } from '@nestjs/common';
import {
  AddProductToCartDto,
  CartResponseDto,
  UpdateCartItemQuantityDto,
} from '@src/common/dtos/cart';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { Cart, CartItem } from '@src/common/entities';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import { paginateArray } from '@src/common/helpers';
import { BookRepositoryService } from '@src/common/repositories/book';
import { CartRepositoryService } from '@src/common/repositories/cart';
import { CartItemRepositoryService } from '@src/common/repositories/cart-item';
import { CartResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { DataSource } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    private cartRepositoryService: CartRepositoryService,
    private cartItemRepositoryService: CartItemRepositoryService,
    private bookRepositoryService: BookRepositoryService,
    private dataSource: DataSource,
  ) {}

  async getCart(
    user: IUser,
    currentPage: number = 1,
    pageSize: number | string = 20,
  ): Promise<PaginatedResponseDto<CartResponseDto>> {
    const cart = await this.cartRepositoryService.findOrCreateByUserId(
      user.id as EntityId,
      ['items', 'items.book'],
    );

    const allItems = cart.items || [];

    // Paginate items array
    const { data: paginatedItems, meta } = paginateArray(
      allItems,
      currentPage,
      pageSize,
    );

    // Create cart copy with paginated items for response
    const cartWithPaginatedItems = Object.assign(
      Object.create(Object.getPrototypeOf(cart)),
      cart,
    );
    cartWithPaginatedItems.items = paginatedItems;

    const cartResponse = CartResource(cartWithPaginatedItems);

    return {
      meta,
      result: [cartResponse],
    };
  }

  async addProduct(
    user: IUser,
    addProductDto: AddProductToCartDto,
  ): Promise<CartResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate product
      const book = await this.bookRepositoryService.findOne(
        addProductDto.product_id,
      );

      if (!book) {
        throw new NotFoundBusinessException('BOOK_NOT_FOUND');
      }

      if (!book.isActive) {
        throw new BadRequestBusinessException('BOOK_NOT_AVAILABLE');
      }

      // Check stock
      const cart = await this.cartRepositoryService.findOrCreateByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      // Check if item already exists in cart
      const existingItem = cart.items?.find(
        (item) => item.book.id === addProductDto.product_id,
      );

      // Calculate total quantity if item exists
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + addProductDto.quantity;

      if (book.quantity < newQuantity) {
        throw new BadRequestBusinessException('INSUFFICIENT_STOCK', {
          available: book.quantity,
          requested: newQuantity,
        });
      }

      const unitPrice = Number(book.price);

      if (existingItem) {
        // Update existing item
        existingItem.updateQuantity(newQuantity, unitPrice);
        await queryRunner.manager.save(CartItem, existingItem);
      } else {
        // Create new cart item
        const cartItem = new CartItem();
        cartItem.cart = cart;
        cartItem.book = book;
        cartItem.quantity = addProductDto.quantity;
        cartItem.unitPrice = unitPrice;
        cartItem.totalPrice = Number(
          (addProductDto.quantity * unitPrice).toFixed(2),
        );
        cartItem.createdAt = cartItem.generateDateNow();
        cartItem.updatedAt = cartItem.generateDateNow();

        await queryRunner.manager.save(CartItem, cartItem);
      }

      // Reload cart with items and recalculate totals
      const updatedCart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: user.id as EntityId } },
        relations: ['items', 'items.book'],
      });

      if (updatedCart) {
        updatedCart.calculateTotals();
        await queryRunner.manager.save(Cart, updatedCart);
      }

      await queryRunner.commitTransaction();

      // Reload for response
      const finalCart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      return CartResource(finalCart);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateQuantity(
    user: IUser,
    itemId: EntityId,
    updateQuantityDto: UpdateCartItemQuantityDto,
  ): Promise<CartResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      if (!cart) {
        throw new NotFoundBusinessException('CART_NOT_FOUND');
      }

      const cartItem = await this.cartItemRepositoryService.findOne(itemId, [
        'book',
        'cart',
      ]);

      if (!cartItem || cartItem.cart?.id !== cart.id) {
        throw new NotFoundBusinessException('CART_ITEM_NOT_FOUND');
      }

      // Verify book still exists
      if (!cartItem.book) {
        throw new NotFoundBusinessException('BOOK_NOT_FOUND');
      }

      if (!cartItem.book.isActive) {
        throw new BadRequestBusinessException('BOOK_NOT_AVAILABLE');
      }

      // Calculate new quantity
      const newQuantity = cartItem.quantity + updateQuantityDto.change;

      if (newQuantity < 1) {
        throw new BadRequestBusinessException('INVALID_QUANTITY');
      }

      if (cartItem.book.quantity < newQuantity) {
        throw new BadRequestBusinessException('INSUFFICIENT_STOCK', {
          available: cartItem.book.quantity,
          requested: newQuantity,
        });
      }

      // Update quantity
      cartItem.updateQuantity(newQuantity, Number(cartItem.unitPrice));

      await queryRunner.manager.save(CartItem, cartItem);

      // Recalculate cart totals
      const updatedCart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: user.id as EntityId } },
        relations: ['items', 'items.book'],
      });

      if (updatedCart) {
        updatedCart.calculateTotals();
        await queryRunner.manager.save(Cart, updatedCart);
      }

      await queryRunner.commitTransaction();

      // Reload for response
      const finalCart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      return CartResource(finalCart);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteItem(user: IUser, itemId: EntityId): Promise<CartResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items'],
      );

      if (!cart) {
        throw new NotFoundBusinessException('CART_NOT_FOUND');
      }

      const cartItem = await this.cartItemRepositoryService.findOne(itemId, [
        'cart',
      ]);

      if (!cartItem || cartItem.cart?.id !== cart.id) {
        throw new NotFoundBusinessException('CART_ITEM_NOT_FOUND');
      }

      // Hard delete
      await queryRunner.manager.delete(CartItem, itemId);

      // Reload cart and recalculate totals
      const updatedCart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      // Reload for response
      const finalCart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      return CartResource(finalCart);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
