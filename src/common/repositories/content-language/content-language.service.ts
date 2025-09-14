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
    contentLanguage.createdAt = new Date();
    contentLanguage.updatedAt = new Date();

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
    await this.repository.update({ key, language }, { content });
  }

  async deleteByKeyAndLanguage(key: string, language: string): Promise<void> {
    await this.repository.delete({ key, language });
  }
}
