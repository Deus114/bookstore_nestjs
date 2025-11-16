import { plainToClass } from 'class-transformer';
import { User } from '../entities';
import { UserInfoResponseDto, UserAddressInfoDto } from '../dtos/auth';

export function UserInfoResource(user: User): UserInfoResponseDto {
  const userInfo = plainToClass(UserInfoResponseDto, user, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  if (user.addresses && user.addresses.length > 0) {
    userInfo.addresses = user.addresses.map((address) =>
      plainToClass(
        UserAddressInfoDto,
        {
          name: address.name,
          phone: address.phone,
          address: address.address,
          isDefault: address.isDefault,
        },
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        },
      ),
    );
  } else {
    userInfo.addresses = [];
  }

  return userInfo;
}
