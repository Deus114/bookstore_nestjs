import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ErrorMessageService {
  constructor(
    private readonly i18nService: I18nService<Record<string, unknown>>,
  ) {}

  async getMessage(
    errorCode: string,
    language: string = 'vi',
  ): Promise<string> {
    const lang = language.startsWith('en') ? 'en' : 'vi';
    try {
      const translated = await this.i18nService.translate(
        `messages.${errorCode}`,
        {
          lang,
        },
      );
      // Nếu translate trả về chính key → không tìm thấy, fallback về error code
      if (translated === `messages.${errorCode}`) {
        return await this.i18nService.translate('messages.500', { lang });
      }
      return translated as string;
    } catch (error) {
      // Fallback về error 500 nếu có lỗi
      return (await this.i18nService.translate('messages.500', {
        lang,
      })) as string;
    }
  }

  async getHttpMessage(
    statusCode: number,
    language: string = 'vi',
  ): Promise<string> {
    const errorCode = statusCode.toString();
    return await this.getMessage(errorCode, language);
  }

  async getSuccessMessage(
    messageKey: string,
    language: string = 'vi',
  ): Promise<string> {
    try {
      const translated = await this.i18nService.translate(
        `messages.${messageKey}`,
        {
          lang: language.startsWith('en') ? 'en' : 'vi',
        },
      );
      // Nếu translate trả về chính key → không tìm thấy, trả về key
      if (translated === `messages.${messageKey}`) {
        return messageKey;
      }
      return translated as string;
    } catch (error) {
      return messageKey;
    }
  }
}
