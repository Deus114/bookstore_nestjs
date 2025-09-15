import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LogService } from '@src/common/logger';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { Request, Response } from 'express';

@Catch()
@Injectable()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly logService: LogService,
    private readonly errorMessageService: ErrorMessageService,
  ) {
    super(httpServer);
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      await this.handleHttpException(exception, request, response);
    } else {
      await this.handleUnknownException(exception, request, response);
    }
  }

  private async handleHttpException(
    exception: HttpException,
    req: Request,
    res: Response,
  ) {
    const language = req.headers['accept-language'] || 'vi';
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let errorCode: string | undefined;
    let errorMessage: string;

    // Extract error code and message
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      const errorObj = errorResponse as any;
      errorCode = errorObj.errorCode || errorObj.code;
      errorMessage = errorObj.message || errorObj.error || exception.message;
    } else {
      errorMessage = exception.message;
    }

    // Translate error message
    const translatedMessage = errorCode
      ? this.errorMessageService.getMessage(errorCode, language)
      : this.errorMessageService.getHttpMessage(status, language);

    // Log error
    this.logService.setChannel('general');
    this.logService.error('HttpException occurred', {
      exception: exception.message,
      status,
      path: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    // Send response
    res.status(status).json({
      statusCode: status,
      message: translatedMessage,
      error: errorCode || 'Unknown Error',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }

  private async handleUnknownException(
    exception: unknown,
    req: Request,
    res: Response,
  ) {
    const language = req.headers['accept-language'] || 'vi';

    // Log error
    this.logService.setChannel('general');
    this.logService.error('UnknownException occurred', {
      exception:
        exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
      path: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    // Translate error message
    const translatedMessage = this.errorMessageService.getHttpMessage(
      HttpStatus.INTERNAL_SERVER_ERROR,
      language,
    );

    // Send response
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: translatedMessage,
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
