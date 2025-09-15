import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '@src/common/repositories/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ErrorMessageService } from '@src/common/services/error-message.service';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UsersController],
  providers: [UsersService, ErrorMessageService],
  exports: [UsersService],
})
export class UsersModule {}
