import { plainToClass } from 'class-transformer';
import { Cart, CartItem } from '../entities';
import { CartResponseDto, CartItemResponseDto } from '../dtos/cart';

export function CartResource(cart: Cart): CartResponseDto {
  return plainToClass(CartResponseDto, cart, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

export function CartItemsResource(
  cartItems: CartItem[],
): CartItemResponseDto[] {
  return cartItems && cartItems.length
    ? cartItems.map((item) => CartItemResource(item))
    : [];
}

export function CartItemResource(cartItem: CartItem): CartItemResponseDto {
  return plainToClass(CartItemResponseDto, cartItem, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
