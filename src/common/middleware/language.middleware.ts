import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Lấy từ Header (Accept-Language)
    const acceptLanguage = req.headers['accept-language'];

    // Determine language
    let language = 'vi'; // Default
    if (acceptLanguage) {
      language = acceptLanguage.startsWith('en') ? 'en' : 'vi';
    }

    // Set vào request object
    (req as any).language = language;

    next();
  }
}
