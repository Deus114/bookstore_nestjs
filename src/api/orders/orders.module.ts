import { Module } from '@nestjs/common';
import { OrderRepositoryModule } from '@src/common/repositories/order';
import { OrderDetailRepositoryModule } from '@src/common/repositories/order-detail';
import { OrderHistory, OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ErrorMessageService } from '@src/common/services/error-message.service';

@Module({
  imports: [OrderRepositoryModule, OrderDetailRepositoryModule],
  controllers: [OrdersController, OrderHistory],
  providers: [OrdersService, ErrorMessageService],
  exports: [OrdersService],
})
export class OrdersModule {}
