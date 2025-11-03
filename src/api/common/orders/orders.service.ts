import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  CreateOrderDto,
  OrderDetailResponseDto,
  OrderResponseDto,
  PreviewOrderResponseDto,
  UserAddressResponseDto,
} from '@src/common/dtos/order';
import {
  Book,
  Cart,
  CartItem,
  Order,
  OrderDetail,
  User,
  UserAddress,
} from '@src/common/entities';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { BookRepositoryService } from '@src/common/repositories/book';
import { CartRepositoryService } from '@src/common/repositories/cart';
import { OrderRepositoryService } from '@src/common/repositories/order';
import { UserAddressRepositoryService } from '@src/common/repositories/user-address';
import { OrderResource, OrdersResource } from '@src/common/resources';
import { OrderPaymentStatus, OrderStatus } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { plainToClass } from 'class-transformer';
import { DataSource } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepositoryService: OrderRepositoryService,
    private cartRepositoryService: CartRepositoryService,
    private bookRepositoryService: BookRepositoryService,
    private userAddressRepositoryService: UserAddressRepositoryService,
    private dataSource: DataSource,
  ) {}

  async preview(
    createOrderDto: CreateOrderDto,
    user: IUser,
  ): Promise<PreviewOrderResponseDto> {
    const source = createOrderDto.source || 'cart';

    // Get default address
    const address = await this.userAddressRepositoryService.findDefaultAddress(
      user.id as EntityId,
    );

    let items: OrderDetailResponseDto[] = [];
    let subtotal = 0;

    if (source === 'buy_now') {
      // Buy now: single product
      if (!createOrderDto.product_id || !createOrderDto.quantity) {
        throw new BadRequestBusinessException('INVALID_REQUEST');
      }

      const book = await this.bookRepositoryService.findOne(
        createOrderDto.product_id,
      );
      if (!book) {
        throw new NotFoundBusinessException('BOOK_NOT_FOUND');
      }
      if (!book.isActive) {
        throw new BadRequestBusinessException('BOOK_NOT_AVAILABLE');
      }

      if (book.quantity < createOrderDto.quantity) {
        throw new BadRequestBusinessException('INSUFFICIENT_STOCK');
      }

      const unitPrice = Number(book.price);
      const totalPrice = unitPrice * createOrderDto.quantity;
      subtotal = totalPrice;

      const itemDto = plainToClass(
        OrderDetailResponseDto,
        {
          quantity: createOrderDto.quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          book: book,
        },
        { excludeExtraneousValues: true, enableImplicitConversion: true },
      );
      items = [itemDto];
    } else {
      // From cart
      if (!createOrderDto.item_ids) {
        throw new BadRequestBusinessException('INVALID_REQUEST');
      }

      const cart = await this.cartRepositoryService.findOneByUserId(
        user.id as EntityId,
        ['items', 'items.book'],
      );

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BadRequestBusinessException('CART_EMPTY');
      }

      const itemIds = createOrderDto.item_ids
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      if (itemIds.length === 0) {
        throw new BadRequestBusinessException('INVALID_REQUEST');
      }

      const selectedItems = cart.items.filter((item) =>
        itemIds.includes(item.id.toString()),
      );

      if (selectedItems.length !== itemIds.length) {
        throw new NotFoundBusinessException('CART_ITEM_NOT_FOUND');
      }

      // Build items preview
      items = selectedItems.map((cartItem) => {
        const totalPrice = Number(cartItem.totalPrice);
        subtotal += totalPrice;

        return plainToClass(
          OrderDetailResponseDto,
          {
            quantity: cartItem.quantity,
            unitPrice: Number(cartItem.unitPrice),
            totalPrice: totalPrice,
            book: cartItem.book,
          },
          { excludeExtraneousValues: true, enableImplicitConversion: true },
        );
      });
    }

    // Calculate totals (currently all fees are 0)
    const shippingFee = 0;
    const discountAmount = 0;
    const totalAmount = subtotal + shippingFee - discountAmount;

    // Format address
    let addressDto = null;
    if (address) {
      addressDto = plainToClass(UserAddressResponseDto, address, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }

    return {
      items,
      address: addressDto,
      summary: {
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
      },
    };
  }

  async create(
    createOrderDto: CreateOrderDto,
    user: IUser,
  ): Promise<OrderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const source = createOrderDto.source || 'cart';

      // Validate and get address
      const address = await this.userAddressRepositoryService.findOne(
        createOrderDto.user_address_id,
        user.id as EntityId,
      );

      if (!address) {
        throw new NotFoundBusinessException('USER_ADDRESS_NOT_FOUND');
      }

      // Create order
      const order = new Order();
      order.user = { id: user.id } as User;
      order.orderCode = order.generateOrderCode();
      order.status = OrderStatus.PENDING;
      order.paymentStatus = OrderPaymentStatus.PENDING;
      order.paymentMethod = createOrderDto.payment_method;
      order.userAddress = address;
      order.notes = createOrderDto.notes;
      order.updateAddressText(address);

      let orderItems: CartItem[] = [];
      let subtotal = 0;

      if (source === 'buy_now') {
        // Buy now: single product
        if (!createOrderDto.product_id || !createOrderDto.quantity) {
          throw new BadRequestBusinessException('INVALID_REQUEST');
        }

        const book = await this.bookRepositoryService.findOne(
          createOrderDto.product_id,
        );
        if (!book) {
          throw new NotFoundBusinessException('BOOK_NOT_FOUND');
        }
        if (!book.isActive) {
          throw new BadRequestBusinessException('BOOK_NOT_AVAILABLE');
        }

        if (book.quantity < createOrderDto.quantity) {
          throw new BadRequestBusinessException('INSUFFICIENT_STOCK');
        }

        const unitPrice = Number(book.price);
        const totalPrice = unitPrice * createOrderDto.quantity;
        subtotal = totalPrice;

        // Create order detail
        const orderDetail = new OrderDetail();
        orderDetail.order = order;
        orderDetail.book = book;
        orderDetail.quantity = createOrderDto.quantity;
        orderDetail.unitPrice = unitPrice;
        orderDetail.totalPrice = totalPrice;

        order.orderDetails = [orderDetail];
      } else {
        // From cart
        if (!createOrderDto.item_ids) {
          throw new BadRequestBusinessException('INVALID_REQUEST');
        }

        const cart = await this.cartRepositoryService.findOneByUserId(
          user.id as EntityId,
          ['items', 'items.book'],
        );

        if (!cart || !cart.items || cart.items.length === 0) {
          throw new BadRequestBusinessException('CART_EMPTY');
        }

        const itemIds = createOrderDto.item_ids
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);

        if (itemIds.length === 0) {
          throw new BadRequestBusinessException('INVALID_REQUEST');
        }

        const selectedItems = cart.items.filter((item) =>
          itemIds.includes(item.id.toString()),
        );

        if (selectedItems.length !== itemIds.length) {
          throw new NotFoundBusinessException('CART_ITEM_NOT_FOUND');
        }

        // Verify stock and calculate subtotal
        for (const cartItem of selectedItems) {
          if (!cartItem.book) {
            throw new NotFoundBusinessException('BOOK_NOT_FOUND');
          }
          if (!cartItem.book.isActive) {
            throw new BadRequestBusinessException('BOOK_NOT_AVAILABLE');
          }

          if (cartItem.book.quantity < cartItem.quantity) {
            throw new BadRequestBusinessException('INSUFFICIENT_STOCK');
          }

          subtotal += Number(cartItem.totalPrice);
        }

        // Create order details
        const orderDetails = selectedItems.map((cartItem) => {
          const orderDetail = new OrderDetail();
          orderDetail.order = order;
          orderDetail.book = cartItem.book;
          orderDetail.quantity = cartItem.quantity;
          orderDetail.unitPrice = Number(cartItem.unitPrice);
          orderDetail.totalPrice = Number(cartItem.totalPrice);
          return orderDetail;
        });

        order.orderDetails = orderDetails;
        orderItems = selectedItems;
      }

      // Calculate totals
      const shippingFee = 0;
      const discountAmount = 0;
      order.subtotal = subtotal;
      order.shippingFee = shippingFee;
      order.discountAmount = discountAmount;
      order.totalAmount = subtotal + shippingFee - discountAmount;

      // Save order (cascade will save order details)
      const savedOrder = await queryRunner.manager.save(Order, order);

      // If from cart, remove selected items from cart
      if (source === 'cart' && orderItems.length > 0) {
        const itemIdsToDelete = orderItems.map((item) => item.id);
        await queryRunner.manager.delete('CartItem', itemIdsToDelete);

        // Reload cart and recalculate totals
        const updatedCart = await queryRunner.manager.findOne(Cart, {
          where: { user: { id: user.id as EntityId } },
          relations: ['items'],
        });
        if (updatedCart) {
          updatedCart.calculateTotals();
          await queryRunner.manager.save(Cart, updatedCart);
        }
      }

      await queryRunner.commitTransaction();

      const finalOrder = await this.orderRepositoryService.findOneWithRelations(
        savedOrder.id,
        user.id as EntityId,
        ['orderDetails', 'userAddress'],
      );

      if (!finalOrder) {
        throw new NotFoundBusinessException('ORDER_NOT_FOUND');
      }

      return OrderResource(finalOrder);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getHistory(user: IUser): Promise<OrderResponseDto[]> {
    const res = await this.orderRepositoryService.findByUserId(
      user.id as EntityId,
    );
    return OrdersResource(res);
  }

  async findAll(
    currentPage: number,
    limit: number,
    qs: string,
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    const queryBuilder = this.orderRepositoryService.getQueryBuilder();

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
      qs,
      alias: 'order',
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      result.map(OrderResource),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  getOrderDashboard = async (): Promise<number> => {
    const count = await this.orderRepositoryService.count();
    return count;
  };
}
