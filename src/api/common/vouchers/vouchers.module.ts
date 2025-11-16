import { Module } from '@nestjs/common';
import { UserVoucherRepositoryModule } from '@src/common/repositories/user-voucher';
import { VoucherRepositoryModule } from '@src/common/repositories/voucher';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [VoucherRepositoryModule, UserVoucherRepositoryModule],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
