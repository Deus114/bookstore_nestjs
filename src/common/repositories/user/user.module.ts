import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/common/entities';
import { ErrorMessageService } from '@src/common/services/error-message.service';

import { UserRepositoryService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepositoryService, ErrorMessageService],
  exports: [UserRepositoryService],
})
export class UserRepositoryModule {}
