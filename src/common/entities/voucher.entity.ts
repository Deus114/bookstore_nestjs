import { Column, Entity, OneToMany } from 'typeorm';
import { VoucherDiscountType, VoucherType } from '../utils/enums';
import { BaseEntity } from './base.entity';
import { UserVoucher } from './user-voucher.entity';

@Entity('vouchers')
export class Voucher extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'timestamptz' })
  expireDate: Date;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  limitPerPerson: number;

  @Column({
    type: 'enum',
    enum: VoucherType,
    enumName: 'voucher_type_enum',
  })
  type: VoucherType;

  @Column({
    type: 'enum',
    enum: VoucherDiscountType,
    enumName: 'voucher_discount_type_enum',
  })
  discountType: VoucherDiscountType;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float', default: 0 })
  minPrice: number;

  @Column({ type: 'float', nullable: true })
  maxAmount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.voucher)
  userVouchers: UserVoucher[];
}
