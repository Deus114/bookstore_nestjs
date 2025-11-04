import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '@src/common/dtos/category';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { NotFoundBusinessException } from '@src/common/exceptions/business.exception';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
  removeVietnameseAccents,
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
    language: string = 'vi',
    search?: string,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const queryBuilder = this.categoryRepositoryService.getQueryBuilder();

    if (search) {
      const normalizedSearch = removeVietnameseAccents(search.trim());

      queryBuilder
        .leftJoin(
          'content_language',
          'nameTranslation',
          'nameTranslation.key = category.nameKey AND nameTranslation.language = :language',
          { language },
        )
        .leftJoin(
          'content_language',
          'descTranslation',
          'descTranslation.key = category.descriptionKey AND descTranslation.language = :language',
          { language },
        )
        .distinct(true)
        .andWhere(
          `(LOWER(unaccent(category.slug)) LIKE :query
          OR LOWER(unaccent(nameTranslation.content)) LIKE :query
          OR LOWER(unaccent(descTranslation.content)) LIKE :query)`,
          {
            query: '%' + normalizedSearch + '%',
            language,
          },
        );
    }

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const categories = await queryBuilder
      .skip(offset)
      .take(finalLimit)
      .getMany();

    if (categories.length === 0) {
      return buildPaginatedResponse([], totalItems, currentPage, finalLimit);
    }

    // Lấy tất cả keys cần thiết (combine trong 1 lần duyệt)
    const nameKeysSet = new Set<string>();
    const descriptionKeysSet = new Set<string>();

    categories.forEach((cat) => {
      if (cat.nameKey) nameKeysSet.add(cat.nameKey);
      if (cat.descriptionKey) descriptionKeysSet.add(cat.descriptionKey);
    });

    const nameKeys = Array.from(nameKeysSet);
    const descriptionKeys = Array.from(descriptionKeysSet);

    // Query translations song song nếu có keys
    const [nameTranslations, descriptionTranslations] = await Promise.all([
      nameKeys.length > 0
        ? this.contentLanguageRepositoryService.findByKeysAndLanguage(
            nameKeys,
            language,
          )
        : Promise.resolve([]),
      descriptionKeys.length > 0
        ? this.contentLanguageRepositoryService.findByKeysAndLanguage(
            descriptionKeys,
            language,
          )
        : Promise.resolve([]),
    ]);

    // Tạo translations map bằng reduce
    const translationsMap = categories.reduce((map, category) => {
      map.set(category.id, {
        nameTranslation: nameTranslations.find(
          (t) => t.key === category.nameKey,
        ),
        descriptionTranslation: descriptionTranslations.find(
          (t) => t.key === category.descriptionKey,
        ),
      });
      return map;
    }, new Map());

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

    const [nameTranslation, descriptionTranslation] = await Promise.all([
      this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.nameKey,
        language,
      ),
      category.descriptionKey
        ? this.contentLanguageRepositoryService.findByKeyAndLanguage(
            category.descriptionKey,
            language,
          )
        : Promise.resolve(null),
    ]);

    return CategoryResource(category, nameTranslation, descriptionTranslation);
  }
}
