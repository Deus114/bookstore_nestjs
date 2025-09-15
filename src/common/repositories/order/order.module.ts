import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@src/common/entities';
import { ErrorMessageService } from '@src/common/services/error-message.service';

import { OrderRepositoryService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderRepositoryService, ErrorMessageService],
  exports: [OrderRepositoryService],
})
export class OrderRepositoryModule {}
