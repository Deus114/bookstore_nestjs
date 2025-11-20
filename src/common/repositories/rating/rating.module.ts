import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '@src/common/entities';
import { RatingRepositoryService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingRepositoryService],
  exports: [RatingRepositoryService],
})
export class RatingRepositoryModule {}
