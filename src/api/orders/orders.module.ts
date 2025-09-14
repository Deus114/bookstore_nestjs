import { Module } from '@nestjs/common';
import { OrderRepositoryModule } from '@src/common/repositories/order';
import { OrderDetailRepositoryModule } from '@src/common/repositories/order-detail';
import { OrderHistory, OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [OrderRepositoryModule, OrderDetailRepositoryModule],
  controllers: [OrdersController, OrderHistory],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
