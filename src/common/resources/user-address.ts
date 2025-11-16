import { plainToClass } from 'class-transformer';
import { UserAddress } from '../entities';
import { UserAddressResponseDto } from '../dtos/user-address';

export function UserAddressesResource(
  addresses: UserAddress[],
): UserAddressResponseDto[] {
  return addresses && addresses.length
    ? addresses.map((address) => UserAddressResource(address))
    : [];
}

export function UserAddressResource(
  address: UserAddress,
): UserAddressResponseDto {
  return plainToClass(UserAddressResponseDto, address, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
