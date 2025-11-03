import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { ContentLanguageRepositoryModule } from '@src/common/repositories/content-language';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [CategoryRepositoryModule, ContentLanguageRepositoryModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
