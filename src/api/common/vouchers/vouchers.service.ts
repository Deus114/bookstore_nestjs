import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  ClaimVoucherDto,
  UserVoucherResponseDto,
  VoucherResponseDto,
} from '@src/common/dtos/voucher';
import { User, UserVoucher, Voucher } from '@src/common/entities';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { UserVoucherRepositoryService } from '@src/common/repositories/user-voucher';
import { VoucherRepositoryService } from '@src/common/repositories/voucher';
import { UserVoucherResource, VouchersResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { VoucherDiscountType, VoucherType } from '@src/common/utils/enums';

@Injectable()
export class VouchersService {
  constructor(
    private readonly voucherRepositoryService: VoucherRepositoryService,
    private readonly userVoucherRepositoryService: UserVoucherRepositoryService,
  ) {}

  async findAll(
    currentPage: number,
    limit: number,
    search?: string,
    type?: VoucherType,
    discountType?: VoucherDiscountType,
  ): Promise<PaginatedResponseDto<VoucherResponseDto>> {
    const queryBuilder = this.voucherRepositoryService
      .getQueryBuilder()
      .where('voucher.quantity > 0')
      .andWhere('voucher.expireDate >= :now', { now: new Date() });

    if (search) {
      queryBuilder.andWhere('LOWER(unaccent(voucher.name)) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (type) {
      queryBuilder.andWhere('voucher.type = :type', { type });
    }

    if (discountType) {
      queryBuilder.andWhere('voucher.discountType = :discountType', {
        discountType,
      });
    }

    queryBuilder.orderBy('voucher.createdAt', 'DESC');

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      VouchersResource(result),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async claimVoucher(
    claimVoucherDto: ClaimVoucherDto,
    user: IUser,
  ): Promise<UserVoucherResponseDto> {
    const voucher = await this.voucherRepositoryService.findByCode(
      claimVoucherDto.code,
    );
    if (!voucher) {
      throw new BadRequestException('VOUCHER_NOT_FOUND');
    }

    if (voucher.quantity <= 0) {
      throw new BadRequestException('VOUCHER_OUT_OF_STOCK');
    }

    if (voucher.expireDate < new Date()) {
      throw new BadRequestException('VOUCHER_EXPIRED');
    }

    const userVoucher =
      await this.userVoucherRepositoryService.findByVoucherAndUser(
        voucher.id,
        user.id as EntityId,
      );

    if (
      voucher.limitPerPerson > 0 &&
      userVoucher &&
      userVoucher.quantity >= voucher.limitPerPerson
    ) {
      throw new BadRequestException('VOUCHER_LIMIT_REACHED');
    }

    voucher.quantity -= 1;
    voucher.updatedBy = user.id as string;
    await this.voucherRepositoryService.update(voucher);

    let record = userVoucher;
    if (record) {
      record.quantity += 1;
      record.updatedBy = user.id as string;
      record = await this.userVoucherRepositoryService.update(record);
    } else {
      const newRecord = new UserVoucher();
      newRecord.voucher = voucher as Voucher;
      newRecord.user = { id: user.id } as User;
      newRecord.quantity = 1;
      newRecord.createdBy = user.id as string;
      record = await this.userVoucherRepositoryService.create(newRecord);
    }

    return UserVoucherResource(record);
  }

  async getUserVouchers(user: IUser): Promise<UserVoucherResponseDto[]> {
    const userVouchers = await this.userVoucherRepositoryService.findByUser(
      user.id as EntityId,
    );
    return userVouchers.map((item) => UserVoucherResource(item));
  }
}
