import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from '@src/common/entities';

import { OrderDetailRepositoryService } from './order-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [OrderDetailRepositoryService],
  exports: [OrderDetailRepositoryService],
})
export class OrderDetailRepositoryModule {}
