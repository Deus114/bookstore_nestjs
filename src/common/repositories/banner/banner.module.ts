import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '@src/common/entities';
import { BannerRepositoryService } from './banner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  providers: [BannerRepositoryService],
  exports: [BannerRepositoryService],
})
export class BannerRepositoryModule {}
