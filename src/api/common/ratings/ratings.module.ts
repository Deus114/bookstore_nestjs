import { Module } from '@nestjs/common';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { RatingRepositoryModule } from '@src/common/repositories/rating';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  imports: [RatingRepositoryModule, BookRepositoryModule],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
