import { plainToClass } from 'class-transformer';
import { Banner } from '../entities';
import { BannerResponseDto } from '../dtos/banner';

export function BannersResource(banners: Banner[]): BannerResponseDto[] {
  return banners && banners.length
    ? banners.map((banner) => BannerResource(banner))
    : [];
}

export function BannerResource(banner: Banner): BannerResponseDto {
  return plainToClass(BannerResponseDto, banner, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
