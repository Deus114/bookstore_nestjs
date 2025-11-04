import { Module } from '@nestjs/common';
import { BannerRepositoryModule } from '@src/common/repositories/banner';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  imports: [BannerRepositoryModule],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
