import { Injectable } from '@nestjs/common';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/common/dtos/category';
import { Category, ContentLanguage } from '@src/common/entities';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { ContentLanguageRepositoryService } from '@src/common/repositories/content-language';
import { CategoryResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class CategoriesService {
  constructor(
    private categoryRepositoryService: CategoryRepositoryService,
    private contentLanguageRepositoryService: ContentLanguageRepositoryService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: IUser,
  ): Promise<CategoryResponseDto> {
    if (createCategoryDto.slug) {
      const existingCategory = await this.categoryRepositoryService
        .getQueryBuilder()
        .where('category.slug = :slug', { slug: createCategoryDto.slug })
        .getOne();

      if (existingCategory) {
        throw new BadRequestBusinessException('CATEGORY_SLUG_EXISTS');
      }
    }

    // Tạo keys cho translations
    const nameKey = `category_lang_key_vi_${Date.now()}`;
    const descriptionKey = `category_lang_key_vi_${Date.now()}_desc`;

    // Tạo category entity instance
    const category = new Category();
    category.nameKey = nameKey;
    category.descriptionKey = descriptionKey;
    category.slug = createCategoryDto.slug;
    category.icon = createCategoryDto.icon;
    category.sortOrder = createCategoryDto.sortOrder || 0;
    category.isActive = true;
    category.createdBy = user.id as EntityId;

    const savedCategory = await this.categoryRepositoryService.create(category);

    // Tạo translations
    const contentLanguageVi = new ContentLanguage();
    contentLanguageVi.key = nameKey;
    contentLanguageVi.content = createCategoryDto.titleVi;
    contentLanguageVi.language = 'vi';
    await this.contentLanguageRepositoryService.create(contentLanguageVi);

    const contentLanguageEn = new ContentLanguage();
    contentLanguageEn.key = nameKey;
    contentLanguageEn.content = createCategoryDto.titleEn;
    contentLanguageEn.language = 'en';
    await this.contentLanguageRepositoryService.create(contentLanguageEn);

    if (createCategoryDto.descriptionVi) {
      const descVi = new ContentLanguage();
      descVi.key = descriptionKey;
      descVi.content = createCategoryDto.descriptionVi;
      descVi.language = 'vi';
      await this.contentLanguageRepositoryService.create(descVi);
    }

    if (createCategoryDto.descriptionEn) {
      const descEn = new ContentLanguage();
      descEn.key = descriptionKey;
      descEn.content = createCategoryDto.descriptionEn;
      descEn.language = 'en';
      await this.contentLanguageRepositoryService.create(descEn);
    }

    // Load lại category với translations
    const nameTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        nameKey,
        'vi',
      );
    const descriptionTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        descriptionKey,
        'vi',
      );

    return CategoryResource(
      savedCategory,
      nameTranslation,
      descriptionTranslation,
    );
  }

  async update(
    id: EntityId,
    updateCategoryDto: UpdateCategoryDto,
    user: IUser,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
    }

    // Kiểm tra slug nếu có thay đổi
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepositoryService
        .getQueryBuilder()
        .where('category.slug = :slug', { slug: updateCategoryDto.slug })
        .andWhere('category.id != :id', { id })
        .getOne();

      if (existingCategory) {
        throw new BadRequestBusinessException('CATEGORY_SLUG_EXISTS');
      }
    }

    if (updateCategoryDto.slug) {
      category.slug = updateCategoryDto.slug;
    }
    if (updateCategoryDto.icon) {
      category.icon = updateCategoryDto.icon;
    }
    if (updateCategoryDto.sortOrder) {
      category.sortOrder = updateCategoryDto.sortOrder;
    }
    if (user.id) {
      category.updatedBy = user.id as EntityId;
    }
    await this.categoryRepositoryService.update(category);

    if (updateCategoryDto.titleVi) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.nameKey,
        'vi',
        updateCategoryDto.titleVi,
      );
    }

    if (updateCategoryDto.titleEn) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.nameKey,
        'en',
        updateCategoryDto.titleEn,
      );
    }

    if (updateCategoryDto.descriptionVi) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.descriptionKey,
        'vi',
        updateCategoryDto.descriptionVi,
      );
    }

    if (updateCategoryDto.descriptionEn) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.descriptionKey,
        'en',
        updateCategoryDto.descriptionEn,
      );
    }

    // Load lại category với translations
    const nameTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.nameKey,
        'vi',
      );
    const descriptionTranslation =
      await this.contentLanguageRepositoryService.findByKeyAndLanguage(
        category.descriptionKey,
        'vi',
      );

    return CategoryResource(category, nameTranslation, descriptionTranslation);
  }

  async remove(id: EntityId, user: IUser): Promise<boolean> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
    }

    await this.categoryRepositoryService.softDelete(id, user.id as EntityId);
    return true;
  }
}
