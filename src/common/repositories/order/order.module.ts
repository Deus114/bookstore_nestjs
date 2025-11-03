import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@src/common/entities';

import { OrderRepositoryService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderRepositoryService],
  exports: [OrderRepositoryService],
})
export class OrderRepositoryModule {}
