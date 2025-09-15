import { plainToClass } from 'class-transformer';
import { User } from '../entities';
import { UserResponseDto } from '../dtos/user';

export function UsersResource(users: User[]): UserResponseDto[] {
  return users && users.length
    ? users.map((user) => {
        return UserResource(user);
      })
    : [];
}

export function UserResource(user: User): UserResponseDto {
  return plainToClass(UserResponseDto, user, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
