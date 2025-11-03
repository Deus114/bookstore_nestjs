import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '@src/common/entities';
import { CartItemRepositoryService } from './cart-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemRepositoryService],
  exports: [CartItemRepositoryService],
})
export class CartItemRepositoryModule {}
