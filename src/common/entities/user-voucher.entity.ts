import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Voucher } from './voucher.entity';

@Entity('user_vouchers')
export class UserVoucher extends BaseEntity {
  @ManyToOne(() => Voucher, (voucher) => voucher.userVouchers)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: 0 })
  quantity: number;
}
