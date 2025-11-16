import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVoucher } from '@src/common/entities';
import { UserVoucherRepositoryService } from './user-voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserVoucher])],
  providers: [UserVoucherRepositoryService],
  exports: [UserVoucherRepositoryService],
})
export class UserVoucherRepositoryModule {}
