import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const acceptLanguage = req.headers['accept-language'];

    // Lấy ngôn ngữ từ header hoặc query parameter
    const language = (req.query.lang as string) || acceptLanguage || 'vi';

    // Chỉ cho phép vi và en
    const supportedLanguages = ['vi', 'en'];
    const finalLanguage = supportedLanguages.includes(language)
      ? language
      : 'vi';

    // Thêm ngôn ngữ vào request object
    (req as any).language = finalLanguage;

    next();
  }
}
