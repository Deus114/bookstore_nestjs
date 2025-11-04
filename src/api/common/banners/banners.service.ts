import { Injectable } from '@nestjs/common';
import { BannerResponseDto } from '@src/common/dtos/banner';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { BannerRepositoryService } from '@src/common/repositories/banner';
import { BannersResource, BannerResource } from '@src/common/resources';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class BannersService {
  constructor(private bannerRepositoryService: BannerRepositoryService) {}

  async findAll(
    currentPage: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResponseDto<BannerResponseDto>> {
    const queryBuilder = this.bannerRepositoryService.getQueryBuilder();
    queryBuilder.where('banner.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        `(unaccent(banner.name) ILIKE :query
          OR unaccent(banner.description) ILIKE :query
          OR unaccent(banner.url) ILIKE :query)`,
        {
          query: '%' + search + '%',
        },
      );
    }

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const banners = await queryBuilder
      .skip(offset)
      .take(finalLimit)
      .orderBy('banner.sortOrder', 'ASC')
      .addOrderBy('banner.createdAt', 'DESC')
      .getMany();

    return buildPaginatedResponse(
      BannersResource(banners),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findOne(id: EntityId): Promise<BannerResponseDto> {
    const banner = await this.bannerRepositoryService.findOne(id);
    if (!banner || !banner.isActive) {
      throw new NotFoundBusinessException('BANNER_NOT_FOUND');
    }

    return BannerResource(banner);
  }
}
