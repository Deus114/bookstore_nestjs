import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentLanguage } from '@src/common/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ContentLanguageRepositoryService {
  constructor(
    @InjectRepository(ContentLanguage)
    private readonly repository: Repository<ContentLanguage>,
  ) {}

  async create(contentLanguage: ContentLanguage): Promise<ContentLanguage> {
    contentLanguage.createdAt = contentLanguage.generateDateNow();
    contentLanguage.updatedAt = contentLanguage.generateDateNow();
    return await this.repository.save(contentLanguage);
  }

  async findByKeyAndLanguage(
    key: string,
    language: string,
  ): Promise<ContentLanguage> {
    return await this.repository.findOne({
      where: { key, language },
    });
  }

  async findByKeysAndLanguage(
    keys: string[],
    language: string,
  ): Promise<ContentLanguage[]> {
    return await this.repository
      .createQueryBuilder('contentLanguage')
      .where('contentLanguage.key IN (:...keys)', { keys })
      .andWhere('contentLanguage.language = :language', { language })
      .getMany();
  }

  async updateByKeyAndLanguage(
    key: string,
    language: string,
    content: string,
  ): Promise<void> {
    let contentLanguage = await this.findByKeyAndLanguage(key, language);

    if (!contentLanguage) {
      contentLanguage = new ContentLanguage();
      contentLanguage.key = key;
      contentLanguage.language = language;
      contentLanguage.content = content;
      await this.create(contentLanguage);
    } else {
      contentLanguage.content = content;
      await this.update(contentLanguage);
    }
  }

  async update(contentLanguage: ContentLanguage): Promise<ContentLanguage> {
    contentLanguage.updatedAt = contentLanguage.generateDateNow();
    return await this.repository.save(contentLanguage);
  }

  async deleteByKeyAndLanguage(key: string, language: string): Promise<void> {
    await this.repository.delete({ key, language });
  }
}
