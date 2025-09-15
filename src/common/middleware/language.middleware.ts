import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const acceptLanguage = req.headers['accept-language'];
    req.language = acceptLanguage || 'vi';
    next();
  }
}
