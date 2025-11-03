import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { StorageService } from '@src/common/storage';
import { MulterConfigService } from '@src/common/utils/files/multer.config';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ErrorMessageService, StorageService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class FilesModule {}
