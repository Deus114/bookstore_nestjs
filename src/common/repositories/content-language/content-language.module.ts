import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentLanguage } from '@src/common/entities';

import { ContentLanguageRepositoryService } from './content-language.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentLanguage])],
  providers: [ContentLanguageRepositoryService],
  exports: [ContentLanguageRepositoryService],
})
export class ContentLanguageRepositoryModule {}
