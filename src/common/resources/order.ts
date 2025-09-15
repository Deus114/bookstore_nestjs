import { plainToClass } from 'class-transformer';
import { Order } from '../entities';
import { OrderResponseDto } from '../dtos/order';

export function OrdersResource(orders: Order[]): OrderResponseDto[] {
  return orders && orders.length
    ? orders.map((order) => {
        return OrderResource(order);
      })
    : [];
}

export function OrderResource(order: Order): OrderResponseDto {
  return plainToClass(OrderResponseDto, order, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
