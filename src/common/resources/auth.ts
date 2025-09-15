import { plainToClass } from 'class-transformer';
import { User } from '../entities';
import { UserInfoResponseDto } from '../dtos/auth';

export function UserInfoResource(user: User): UserInfoResponseDto {
  return plainToClass(UserInfoResponseDto, user, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
