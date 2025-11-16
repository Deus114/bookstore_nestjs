import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '@src/common/entities';
import { VoucherRepositoryService } from './voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],
  providers: [VoucherRepositoryService],
  exports: [VoucherRepositoryService],
})
export class VoucherRepositoryModule {}




