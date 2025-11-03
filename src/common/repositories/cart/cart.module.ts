import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@src/common/entities';
import { CartRepositoryService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  providers: [CartRepositoryService],
  exports: [CartRepositoryService],
})
export class CartRepositoryModule {}
