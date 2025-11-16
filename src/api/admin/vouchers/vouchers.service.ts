import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
  VoucherResponseDto,
} from '@src/common/dtos/voucher';
import { Voucher } from '@src/common/entities';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import { removeVietnameseAccents } from '@src/common/helpers';
import { VoucherRepositoryService } from '@src/common/repositories/voucher';
import { VoucherResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class VouchersService {
  constructor(
    private readonly voucherRepositoryService: VoucherRepositoryService,
  ) {}

  async create(
    createVoucherDto: CreateVoucherDto,
    user: IUser,
  ): Promise<VoucherResponseDto> {
    const voucher = new Voucher();
    voucher.name = createVoucherDto.name;
    voucher.code = await this.generateVoucherCode(createVoucherDto.name);
    voucher.expireDate = new Date(createVoucherDto.expireDate);
    voucher.quantity = createVoucherDto.quantity;
    voucher.limitPerPerson = createVoucherDto.limitPerPerson;
    voucher.type = createVoucherDto.type;
    voucher.discountType = createVoucherDto.discountType;
    voucher.amount = createVoucherDto.amount;
    voucher.minPrice = createVoucherDto.minPrice ?? 0;
    voucher.maxAmount = createVoucherDto.maxAmount;
    voucher.description = createVoucherDto.description;
    voucher.image = createVoucherDto.image;
    voucher.createdBy = user?.id as string;

    const result = await this.voucherRepositoryService.create(voucher);
    return VoucherResource(result);
  }

  async update(
    id: EntityId,
    updateVoucherDto: UpdateVoucherDto,
    user: IUser,
  ): Promise<VoucherResponseDto> {
    const voucher = await this.voucherRepositoryService.findOne(id);
    if (!voucher) {
      throw new NotFoundBusinessException('VOUCHER_NOT_FOUND');
    }

    if (updateVoucherDto.code && updateVoucherDto.code !== voucher.code) {
      const existingCode = await this.voucherRepositoryService.findByCode(
        updateVoucherDto.code,
      );
      if (existingCode) {
        throw new BadRequestException({
          errorCode: 'VOUCHER_CODE_EXISTS',
        });
      }
      voucher.code = updateVoucherDto.code;
    }

    if (updateVoucherDto.name) {
      voucher.name = updateVoucherDto.name;
    }
    if (updateVoucherDto.expireDate) {
      voucher.expireDate = new Date(updateVoucherDto.expireDate);
    }
    if (updateVoucherDto.quantity) {
      voucher.quantity = updateVoucherDto.quantity;
    }
    if (updateVoucherDto.limitPerPerson) {
      voucher.limitPerPerson = updateVoucherDto.limitPerPerson;
    }
    if (updateVoucherDto.type) {
      voucher.type = updateVoucherDto.type;
    }
    if (updateVoucherDto.discountType) {
      voucher.discountType = updateVoucherDto.discountType;
    }
    if (updateVoucherDto.amount) {
      voucher.amount = updateVoucherDto.amount;
    }
    if (updateVoucherDto.minPrice) {
      voucher.minPrice = updateVoucherDto.minPrice;
    }
    if (updateVoucherDto.maxAmount !== undefined) {
      voucher.maxAmount = updateVoucherDto.maxAmount;
    }
    if (updateVoucherDto.description) {
      voucher.description = updateVoucherDto.description;
    }
    if (updateVoucherDto.image !== undefined) {
      voucher.image = updateVoucherDto.image;
    }

    voucher.updatedBy = user?.id as string;

    const updated = await this.voucherRepositoryService.update(voucher);
    return VoucherResource(updated);
  }

  async remove(id: EntityId): Promise<boolean> {
    const voucher = await this.voucherRepositoryService.findOne(id);
    if (!voucher) {
      throw new NotFoundBusinessException('VOUCHER_NOT_FOUND');
    }
    await this.voucherRepositoryService.delete(id);
    return true;
  }

  private async generateVoucherCode(name: string): Promise<string> {
    let normalized = removeVietnameseAccents(name || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    if (!normalized.length) {
      normalized = 'VCH';
    }

    const base =
      normalized.length >= 3
        ? normalized.substring(0, 3)
        : normalized.padEnd(3, 'X');

    let candidate = base;
    let suffix = 1;
    // Ensure uniqueness
    while (await this.voucherRepositoryService.findByCode(candidate)) {
      candidate = `${base}${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
