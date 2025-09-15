import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@src/common/entities';
import { ErrorMessageService } from '@src/common/services/error-message.service';

import { BookRepositoryService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookRepositoryService, ErrorMessageService],
  exports: [BookRepositoryService],
})
export class BookRepositoryModule {}
