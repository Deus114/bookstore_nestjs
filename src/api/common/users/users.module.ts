import { Module } from '@nestjs/common';
import { UserAddressRepositoryModule } from '@src/common/repositories/user-address';
import { UserRepositoryModule } from '@src/common/repositories/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserRepositoryModule, UserAddressRepositoryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
