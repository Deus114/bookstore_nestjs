import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { BusinessException } from '@src/common/exceptions/business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Lấy ngôn ngữ từ request
    const language = (request as any).language || 'vi';

    let message = exception.message;
    let errorCode = null;

    // Kiểm tra nếu là BusinessException
    if (exception instanceof BusinessException) {
      const exceptionResponse = exception.getResponse() as any;
      if (exceptionResponse.messageKey) {
        try {
          message = await this.i18nService.translate(
            exceptionResponse.messageKey,
            {
              lang: language,
            },
          );
          errorCode = exceptionResponse.messageKey;
        } catch (error) {
          // Fallback về message gốc nếu không translate được
          message = exceptionResponse.messageKey;
        }
      }
    } else {
      // Kiểm tra nếu message là một i18n key (có dạng 'category.not_found')
      const messageKeyPattern = /^[a-zA-Z_]+\.[a-zA-Z_]+$/;
      if (messageKeyPattern.test(message)) {
        try {
          const translatedMessage = await this.i18nService.translate(message, {
            lang: language,
          });
          if (translatedMessage !== message) {
            message = translatedMessage as string;
            errorCode = message;
          }
        } catch (error) {
          // Fallback về message gốc nếu không translate được
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
