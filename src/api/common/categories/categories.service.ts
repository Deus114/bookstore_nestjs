import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '@src/common/dtos/category';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { ContentLanguageRepositoryService } from '@src/common/repositories/content-language';
import { CategoriesResource, CategoryResource } from '@src/common/resources';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class CategoriesService {
  constructor(
    private categoryRepositoryService: CategoryRepositoryService,
    private contentLanguageRepositoryService: ContentLanguageRepositoryService,
  ) {}

  async findAll(
    currentPage: number,
    limit: number,
    qs: string,
    language: string = 'vi',
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const queryBuilder = this.categoryRepositoryService.getQueryBuilder();

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
      qs,
      alias: 'category',
    });

    const categories = await queryBuilder
      .skip(offset)
      .take(finalLimit)
      .getMany();

    // Lấy tất cả keys cần thiết
    const nameKeys = categories.map((cat) => cat.nameKey);
    const descriptionKeys = categories
      .map((cat) => cat.descriptionKey)
      .filter(Boolean);

    const nameTranslations =
      await this.contentLanguageRepositoryService.findByKeysAndLanguage(
        nameKeys,
        language,
      );
    const descriptionTranslations =
      await this.contentLanguageRepositoryService.findByKeysAndLanguage(
        descriptionKeys,
        language,
      );

    // Tạo translations map
    const translationsMap = new Map();
    categories.forEach((category) => {
      const nameTranslation = nameTranslations.find(
        (t) => t.key === category.nameKey,
      );
      const descriptionTranslation = descriptionTranslations.find(
        (t) => t.key === category.descriptionKey,
      );
      translationsMap.set(category.id, {
        nameTranslation,
        descriptionTranslation,
      });
    });

    return buildPaginatedResponse(
      CategoriesResource(categories, translationsMap),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findOne(
    id: EntityId,
    language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
    }

    // Lấy translations
    const nameTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.nameKey,
        language,
      );
    const descriptionTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.descriptionKey,
        language,
      );

    return CategoryResource(category, nameTranslation, descriptionTranslation);
  }
}
