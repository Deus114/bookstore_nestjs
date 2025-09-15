import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from '@src/common/entities';
import { ErrorMessageService } from '@src/common/services/error-message.service';

import { OrderDetailRepositoryService } from './order-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [OrderDetailRepositoryService, ErrorMessageService],
  exports: [OrderDetailRepositoryService],
})
export class OrderDetailRepositoryModule {}
