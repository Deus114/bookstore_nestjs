import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from '@src/common/entities';
import { UserAddressRepositoryService } from './user-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  providers: [UserAddressRepositoryService],
  exports: [UserAddressRepositoryService],
})
export class UserAddressRepositoryModule {}

