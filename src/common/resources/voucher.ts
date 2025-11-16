import {
  UserVoucherResponseDto,
  VoucherResponseDto,
} from '@src/common/dtos/voucher';
import { UserVoucher, Voucher } from '@src/common/entities';
import { plainToClass } from 'class-transformer';

export function VoucherResource(voucher: Voucher): VoucherResponseDto {
  return plainToClass(VoucherResponseDto, voucher, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

export function VouchersResource(vouchers: Voucher[]): VoucherResponseDto[] {
  if (!vouchers || !vouchers.length) {
    return [];
  }
  return vouchers.map((voucher) => VoucherResource(voucher));
}

export function UserVoucherResource(
  userVoucher: UserVoucher,
): UserVoucherResponseDto {
  return plainToClass(
    UserVoucherResponseDto,
    {
      voucher: VoucherResource(userVoucher.voucher),
      quantity: userVoucher.quantity,
    },
    {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    },
  );
}
