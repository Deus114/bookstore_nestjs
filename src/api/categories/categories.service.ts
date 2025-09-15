import { Injectable } from '@nestjs/common';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/common/dtos/category';
import { CreateResponseDto } from '@src/common/dtos/common';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { ContentLanguageRepositoryService } from '@src/common/repositories/content-language';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { plainToClass } from 'class-transformer';
import { CategoryResource, CategoriesResource } from '@src/common/resources';

@Injectable()
export class CategoriesService {
  constructor(
    private categoryRepositoryService: CategoryRepositoryService,
    private contentLanguageRepositoryService: ContentLanguageRepositoryService,
    private errorMessageService: ErrorMessageService,
  ) {}

  async findAll(language: string = 'vi'): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepositoryService.findAll();

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

    // Map translations với categories
    return categories.map((category) => {
      const nameTranslation = nameTranslations.find(
        (t) => t.key === category.nameKey,
      );
      const descriptionTranslation = descriptionTranslations.find(
        (t) => t.key === category.descriptionKey,
      );

      return plainToClass(
        CategoryResponseDto,
        {
          id: category.id,
          title: nameTranslation?.content || category.nameKey,
          description:
            descriptionTranslation?.content || category.descriptionKey,
          slug: category.slug,
          icon: category.icon,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
        { excludeExtraneousValues: true, enableImplicitConversion: true },
      );
    });
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

    return plainToClass(
      CategoryResponseDto,
      {
        id: category.id,
        title: nameTranslation?.content || category.nameKey,
        description: descriptionTranslation?.content || category.descriptionKey,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      { excludeExtraneousValues: true, enableImplicitConversion: true },
    );
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    user: IUser,
  ): Promise<CreateResponseDto> {
    // Kiểm tra slug đã tồn tại
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

    // Tạo category
    const category = await this.categoryRepositoryService.create({
      nameKey,
      descriptionKey,
      slug: createCategoryDto.slug,
      icon: createCategoryDto.icon,
      sortOrder: createCategoryDto.sortOrder || 0,
      isActive: true,
      createdBy: user.id,
    } as any);

    // Tạo translations
    const translations = [
      {
        key: nameKey,
        content: createCategoryDto.titleVi,
        language: 'vi',
      },
      {
        key: nameKey,
        content: createCategoryDto.titleEn,
        language: 'en',
      },
    ];

    if (createCategoryDto.descriptionVi) {
      translations.push({
        key: descriptionKey,
        content: createCategoryDto.descriptionVi,
        language: 'vi',
      });
    }

    if (createCategoryDto.descriptionEn) {
      translations.push({
        key: descriptionKey,
        content: createCategoryDto.descriptionEn,
        language: 'en',
      });
    }

    // Create translations individually
    for (const translation of translations) {
      await this.contentLanguageRepositoryService.create(translation as any);
    }

    return plainToClass(
      CreateResponseDto,
      {
        id: category.id,
        createdAt: category.createdAt,
      },
      { excludeExtraneousValues: true, enableImplicitConversion: true },
    );
  }

  async update(
    id: EntityId,
    updateCategoryDto: UpdateCategoryDto,
    user: IUser,
  ): Promise<void> {
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

    // Cập nhật category
    await this.categoryRepositoryService.updateById(id, {
      slug: updateCategoryDto.slug,
      icon: updateCategoryDto.icon,
      sortOrder: updateCategoryDto.sortOrder,
      updatedBy: user.id,
    });

    // Cập nhật translations
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
  }

  async remove(id: EntityId, user: IUser): Promise<void> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('CATEGORY_NOT_FOUND');
    }

    await this.categoryRepositoryService.softDelete(id, user.id);
  }

  async findBySlug(
    slug: string,
    language: string = 'vi',
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepositoryService
      .getQueryBuilder()
      .where('category.slug = :slug', { slug })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .getOne();

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

    return plainToClass(
      CategoryResponseDto,
      {
        id: category.id,
        title: nameTranslation?.content || category.nameKey,
        description: descriptionTranslation?.content || category.descriptionKey,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );
  }
}
