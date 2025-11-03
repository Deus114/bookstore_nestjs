import { plainToClass } from 'class-transformer';
import { Cart } from '../entities';
import { CartResponseDto } from '../dtos/cart';

export function CartsResource(carts: Cart[]): CartResponseDto[] {
  return carts && carts.length ? carts.map((cart) => CartResource(cart)) : [];
}

export function CartResource(cart: Cart): CartResponseDto {
  return plainToClass(CartResponseDto, cart, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
