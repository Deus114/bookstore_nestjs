import { Injectable } from '@nestjs/common';
import { OrderResource, OrdersResource } from '@src/common/resources';
import { CreateOrderDto, OrderResponseDto } from '@src/common/dtos/order';
import { CreateResponseDto } from '@src/common/dtos/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { Order, OrderDetail, User } from '@src/common/entities';
import { OrderRepositoryService } from '@src/common/repositories/order';
import { OrderDetailRepositoryService } from '@src/common/repositories/order-detail';
import { OrderPaymentStatus } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import aqp from 'api-query-params';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepositoryService: OrderRepositoryService,
    private orderDetailRepositoryService: OrderDetailRepositoryService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreateResponseDto> {
    // Tạo order trước với quan hệ
    const order = new Order();
    order.user = { id: createOrderDto.userId } as User; // Reference to user
    order.name = createOrderDto.name;
    order.address = createOrderDto.address;
    order.totalPrice = createOrderDto.totalPrice;
    order.phone = createOrderDto.phone;
    order.type = createOrderDto.type;
    order.paymentStatus = OrderPaymentStatus.UNPAID;

    const savedOrder = await this.orderRepositoryService.create(order);

    // Tạo order details với quan hệ
    for (const detail of createOrderDto.orderDetails) {
      const orderDetail = new OrderDetail();
      orderDetail.order = savedOrder;
      orderDetail.book = { id: detail.bookId } as any; // Reference to book
      orderDetail.quantity = detail.quantity;
      orderDetail.price = detail.price;

      await this.orderDetailRepositoryService.create(orderDetail);
    }

    return {
      id: savedOrder.id,
      createdAt: savedOrder.createdAt,
    };
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
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const queryBuilder = this.orderRepositoryService.getQueryBuilder();

    // Apply filters
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        queryBuilder.andWhere(`order.${key} = :${key}`, { [key]: filter[key] });
      }
    });

    // Apply sorting
    if (sort) {
      Object.keys(sort).forEach((key) => {
        queryBuilder.addOrderBy(
          `order.${key}`,
          sort[key] === 1 ? 'ASC' : 'DESC',
        );
      });
    }

    const totalItems = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await queryBuilder.skip(offset).take(defaultLimit).getMany();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: OrdersResource(result),
    };
  }

  getOrderDashboard = async (): Promise<number> => {
    const count = await this.orderRepositoryService.count();
    return count;
  };
}
