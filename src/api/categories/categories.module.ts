import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '@src/common/repositories/category';
import { ContentLanguageRepositoryModule } from '@src/common/repositories/content-language';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ErrorMessageService } from '@src/common/services/error-message.service';

@Module({
  imports: [CategoryRepositoryModule, ContentLanguageRepositoryModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, ErrorMessageService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
