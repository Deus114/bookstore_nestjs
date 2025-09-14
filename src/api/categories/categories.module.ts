import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { ContentLanguageRepositoryModule } from '@src/common/repositories/content-language';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    I18nModule,
    CategoryRepositoryModule,
    ContentLanguageRepositoryModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
