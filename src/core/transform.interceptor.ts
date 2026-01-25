import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from 'src/decorator/customize';
import { Response } from '../common/utils/interfaces';
import { ErrorMessageService } from '../common/services/error-message.service';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(
    private reflector: Reflector,
    private errorMessageService: ErrorMessageService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const messageKey = this.reflector.get<string>(
      RESPONSE_MESSAGE,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const language = (req as any).language || 'vi';

    return next.handle().pipe(
      switchMap((data) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;

        if (!messageKey) {
          return of({ statusCode, message: '', data });
        }

        return from(
          this.errorMessageService.getSuccessMessage(messageKey, language),
        ).pipe(
          map((message) => ({
            statusCode,
            message,
            data,
          })),
        );
      }),
    );
  }
}
