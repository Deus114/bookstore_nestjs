import { Module } from '@nestjs/common';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { CartRepositoryModule } from '@src/common/repositories/cart';
import { OrderRepositoryModule } from '@src/common/repositories/order';
import { OrderDetailRepositoryModule } from '@src/common/repositories/order-detail';
import { UserAddressRepositoryModule } from '@src/common/repositories/user-address';
import { OrderHistory, OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    OrderRepositoryModule,
    OrderDetailRepositoryModule,
    CartRepositoryModule,
    BookRepositoryModule,
    UserAddressRepositoryModule,
  ],
  controllers: [OrdersController, OrderHistory],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
