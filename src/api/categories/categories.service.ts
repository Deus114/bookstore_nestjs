import { Injectable } from '@nestjs/common';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/common/dto/category';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import { CategoryRepositoryService } from '@src/common/repositories/category';
import { ContentLanguageRepositoryService } from '@src/common/repositories/content-language';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId, Relation } from '@src/common/utils/types';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoriesService {
  constructor(
    private categoryRepositoryService: CategoryRepositoryService,
    private contentLanguageRepositoryService: ContentLanguageRepositoryService,
  ) {}

  async findAll(language: string = 'vi'): Promise<CategoryResponseDto[]> {
    const queryBuilder = this.categoryRepositoryService.getQueryBuilder();

    const result = await queryBuilder
      .leftJoinAndMapOne(
        'category.nameLang',
        'content_language',
        'nameLang',
        'nameLang.key = category.nameKey AND nameLang.language = :lang',
        { lang: language },
      )
      .leftJoinAndMapOne(
        'category.descriptionLang',
        'content_language',
        'descLang',
        'descLang.key = category.descriptionKey AND descLang.language = :lang',
        { lang: language },
      )
      .select([
        'category.id',
        'category.nameKey',
        'category.descriptionKey',
        'category.slug',
        'category.icon',
        'category.sortOrder',
        'category.isActive',
        'category.createdAt',
        'category.updatedAt',
      ])
      .addSelect('nameLang.content', 'name')
      .addSelect('descLang.content', 'description')
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.createdAt', 'DESC')
      .getRawAndEntities();

    return result.entities.map((entity, index) => ({
      id: entity.id,
      name: result.raw[index]?.name || entity.nameKey,
      description: result.raw[index]?.description || entity.descriptionKey,
      slug: entity.slug,
      icon: entity.icon,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }));
  }

  async findAllSimple(language: string = 'vi'): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepositoryService.findAll();

    // Lấy tất cả keys cần thiết
    const nameKeys = categories.map((cat) => cat.nameKey);
    const translations =
      await this.contentLanguageRepositoryService.findByKeysAndLanguage(
        nameKeys,
        language,
      );

    // Map translations với categories
    return categories.map((category) => {
      const nameTranslation = translations.find(
        (t) => t.key === category.nameKey,
      );
      return {
        id: category.id,
        name: nameTranslation?.content || category.nameKey,
        description: undefined,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    });
  }

  async findOne(
    id: EntityId,
    language: string = 'vi',
    relations: Relation[] = [],
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepositoryService.findOne(
      id,
      relations,
    );
    if (!category) {
      throw new NotFoundBusinessException('category.not_found');
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

    return {
      id: category.id,
      name: nameTranslation?.content || category.nameKey,
      description: descriptionTranslation?.content || category.descriptionKey,
      slug: category.slug,
      icon: category.icon,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    user: IUser,
    language: string = 'vi',
  ): Promise<{ id: string; createdAt: Date }> {
    // Kiểm tra slug đã tồn tại
    const existingCategory = await this.categoryRepositoryService
      .getQueryBuilder()
      .where('category.slug = :slug', { slug: createCategoryDto.slug })
      .getOne();

    if (existingCategory) {
      throw new BadRequestBusinessException('category.slug_exists');
    }

    // Tạo keys cho translations
    const nameKey = `category_${randomUUID()}_name`;
    const descriptionKey = `category_${randomUUID()}_description`;

    // Tạo category
    const category = await this.categoryRepositoryService.create({
      nameKey,
      descriptionKey,
      slug: createCategoryDto.slug,
      icon: createCategoryDto.icon,
      sortOrder: createCategoryDto.sortOrder || 0,
      isActive: createCategoryDto.isActive !== false,
      createdBy: user.id,
    } as any);

    // Tạo translations
    const translations = [
      {
        key: nameKey,
        content: createCategoryDto.nameVi,
        language: 'vi',
      },
      {
        key: nameKey,
        content: createCategoryDto.nameEn,
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

    return {
      id: category.id,
      createdAt: category.createdAt,
    };
  }

  async update(
    id: EntityId,
    updateCategoryDto: UpdateCategoryDto,
    user: IUser,
    language: string = 'vi',
  ): Promise<void> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('category.not_found');
    }

    // Kiểm tra slug nếu có thay đổi
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepositoryService
        .getQueryBuilder()
        .where('category.slug = :slug', { slug: updateCategoryDto.slug })
        .andWhere('category.id != :id', { id })
        .getOne();

      if (existingCategory) {
        throw new BadRequestBusinessException('category.slug_exists');
      }
    }

    // Cập nhật category
    await this.categoryRepositoryService.updateById(id, {
      slug: updateCategoryDto.slug,
      icon: updateCategoryDto.icon,
      sortOrder: updateCategoryDto.sortOrder,
      isActive: updateCategoryDto.isActive,
      updatedBy: user.id,
    });

    // Cập nhật translations
    if (updateCategoryDto.nameVi) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.nameKey,
        'vi',
        updateCategoryDto.nameVi,
      );
    }

    if (updateCategoryDto.nameEn) {
      await this.contentLanguageRepositoryService.updateByKeyAndLanguage(
        category.nameKey,
        'en',
        updateCategoryDto.nameEn,
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

  async remove(
    id: EntityId,
    user: IUser,
    language: string = 'vi',
  ): Promise<void> {
    const category = await this.categoryRepositoryService.findOne(id);
    if (!category) {
      throw new NotFoundBusinessException('category.not_found');
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
      throw new NotFoundBusinessException('category.not_found');
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

    return {
      id: category.id,
      name: nameTranslation?.content || category.nameKey,
      description: descriptionTranslation?.content || category.descriptionKey,
      slug: category.slug,
      icon: category.icon,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  getQueryBuilder() {
    return this.categoryRepositoryService.getQueryBuilder();
  }

  async findWithCustomQuery(
    conditions: any = {},
    language: string = 'vi',
    relations: Relation[] = [],
  ): Promise<CategoryResponseDto[]> {
    const queryBuilder = this.categoryRepositoryService.getQueryBuilder();

    // Thêm relations nếu có
    if (relations.length > 0) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`category.${relation}`, relation);
      });
    }

    const result = await queryBuilder
      .leftJoinAndMapOne(
        'category.nameLang',
        'content_language',
        'nameLang',
        'nameLang.key = category.nameKey AND nameLang.language = :lang',
        { lang: language },
      )
      .leftJoinAndMapOne(
        'category.descriptionLang',
        'content_language',
        'descLang',
        'descLang.key = category.descriptionKey AND descLang.language = :lang',
        { lang: language },
      )
      .select([
        'category.id',
        'category.nameKey',
        'category.descriptionKey',
        'category.slug',
        'category.icon',
        'category.sortOrder',
        'category.isActive',
        'category.createdAt',
        'category.updatedAt',
      ])
      .addSelect('nameLang.content', 'name')
      .addSelect('descLang.content', 'description')
      .where(conditions)
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.createdAt', 'DESC')
      .getRawAndEntities();

    return result.entities.map((entity, index) => ({
      id: entity.id,
      name: result.raw[index]?.name || entity.nameKey,
      description: result.raw[index]?.description || entity.descriptionKey,
      slug: entity.slug,
      icon: entity.icon,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }));
  }
}
