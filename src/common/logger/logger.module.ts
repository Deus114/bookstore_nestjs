import { Global, Module } from '@nestjs/common';

import { LogService } from './logger.service';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService],
})
export class LoggerModule {}
