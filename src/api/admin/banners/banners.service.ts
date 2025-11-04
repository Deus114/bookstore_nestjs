import { Injectable } from '@nestjs/common';
import {
  BannerResponseDto,
  CreateBannerDto,
  UpdateBannerDto,
} from '@src/common/dtos/banner';
import { Banner } from '@src/common/entities';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import { BannerRepositoryService } from '@src/common/repositories/banner';
import { BannerResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class BannersService {
  constructor(private bannerRepositoryService: BannerRepositoryService) {}

  async create(
    createBannerDto: CreateBannerDto,
    user: IUser,
  ): Promise<BannerResponseDto> {
    const banner = new Banner();
    banner.name = createBannerDto.name;
    banner.description = createBannerDto.description;
    banner.url = createBannerDto.url;
    banner.sortOrder = createBannerDto.sortOrder || 0;
    banner.isActive = true;
    banner.createdBy = user.id as EntityId;

    const savedBanner = await this.bannerRepositoryService.create(banner);
    return BannerResource(savedBanner);
  }

  async update(
    id: EntityId,
    updateBannerDto: UpdateBannerDto,
    user: IUser,
  ): Promise<BannerResponseDto> {
    const banner = await this.bannerRepositoryService.findOne(id);
    if (!banner) {
      throw new NotFoundBusinessException('BANNER_NOT_FOUND');
    }

    if (updateBannerDto.name !== undefined) {
      banner.name = updateBannerDto.name;
    }
    if (updateBannerDto.description !== undefined) {
      banner.description = updateBannerDto.description;
    }
    if (updateBannerDto.url !== undefined) {
      banner.url = updateBannerDto.url;
    }
    if (updateBannerDto.sortOrder !== undefined) {
      banner.sortOrder = updateBannerDto.sortOrder;
    }
    if (user.id) {
      banner.updatedBy = user.id as EntityId;
    }

    const updatedBanner = await this.bannerRepositoryService.update(banner);
    return BannerResource(updatedBanner);
  }

  async remove(id: EntityId, user: IUser): Promise<boolean> {
    const banner = await this.bannerRepositoryService.findOne(id);
    if (!banner) {
      throw new NotFoundBusinessException('BANNER_NOT_FOUND');
    }

    await this.bannerRepositoryService.softDelete(id, user.id as EntityId);
    return true;
  }
}
