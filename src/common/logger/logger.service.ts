import * as winston from 'winston';

import { Injectable } from '@nestjs/common';

import {
  authLogger,
  cachingLogger,
  fcmLogger,
  generalLogger,
  ghnLogger,
  ninePayLogger,
  openAILogger,
  orderLogger,
  taskLogger,
  videoLogger,
  workerLogger,
} from './logger.config';

@Injectable()
export class LogService {
  private logger: winston.Logger;

  constructor() {
    this.logger = generalLogger;
  }

  setChannel(channelName: string) {
    switch (channelName) {
      case 'user':
        this.logger = authLogger;
        break;
      case 'GHN':
        this.logger = ghnLogger;
        break;
      case 'fcm':
        this.logger = fcmLogger;
        break;
      case 'video':
        this.logger = videoLogger;
        break;
      case 'caching':
        this.logger = cachingLogger;
        break;
      case '9pay':
        this.logger = ninePayLogger;
        break;
      case 'open-ai':
        this.logger = openAILogger;
        break;
      case 'worker':
        this.logger = workerLogger;
        break;
      case 'order':
        this.logger = orderLogger;
        break;
      case 'task':
        this.logger = taskLogger;
        break;
      default:
        this.logger = generalLogger;
        break;
    }
  }

  // Log info
  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  // Log warning
  warning(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  // Log error
  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  // Log debug
  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  // Log verbose
  verbose(message: string, meta?: any) {
    this.logger.verbose(message, meta);
  }
}
