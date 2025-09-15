import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterConfigService } from './multer.config';
import { ErrorMessageService } from '@src/common/services/error-message.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ErrorMessageService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class FilesModule {}
