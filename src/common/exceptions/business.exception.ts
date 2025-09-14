import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    messageKey: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(
      {
        messageKey,
        details,
      },
      status,
    );
  }
}

export class NotFoundBusinessException extends BusinessException {
  constructor(messageKey: string, details?: any) {
    super(messageKey, HttpStatus.NOT_FOUND, details);
  }
}

export class BadRequestBusinessException extends BusinessException {
  constructor(messageKey: string, details?: any) {
    super(messageKey, HttpStatus.BAD_REQUEST, details);
  }
}

export class ConflictBusinessException extends BusinessException {
  constructor(messageKey: string, details?: any) {
    super(messageKey, HttpStatus.CONFLICT, details);
  }
}
