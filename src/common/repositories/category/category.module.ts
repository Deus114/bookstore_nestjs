import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@src/common/entities';

import { CategoryRepositoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryRepositoryService],
  exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}
