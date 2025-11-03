import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@src/common/entities';

import { BookRepositoryService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookRepositoryService],
  exports: [BookRepositoryService],
})
export class BookRepositoryModule {}
