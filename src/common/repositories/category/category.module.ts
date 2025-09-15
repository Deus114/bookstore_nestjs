import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@src/common/entities';
import { ErrorMessageService } from '@src/common/services/error-message.service';

import { CategoryRepositoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryRepositoryService, ErrorMessageService],
  exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}
