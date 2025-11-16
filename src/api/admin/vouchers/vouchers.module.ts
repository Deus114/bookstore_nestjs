import { Module } from '@nestjs/common';
import { VoucherRepositoryModule } from '@src/common/repositories/voucher';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [VoucherRepositoryModule],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}




