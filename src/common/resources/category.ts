import { plainToClass } from 'class-transformer';
import { Category } from '../entities';
import { CategoryResponseDto } from '../dtos/category';
import { ContentLanguage } from '../entities';

export interface CategoryTranslation {
  nameTranslation?: ContentLanguage;
  descriptionTranslation?: ContentLanguage;
}

export function CategoriesResource(
  categories: Category[],
  translationsMap?: Map<string, CategoryTranslation>,
): CategoryResponseDto[] {
  return categories && categories.length
    ? categories.map((category) => {
        const translations = translationsMap?.get(category.id);
        return CategoryResource(
          category,
          translations?.nameTranslation,
          translations?.descriptionTranslation,
        );
      })
    : [];
}

export function CategoryResource(
  category: Category,
  nameTranslation?: ContentLanguage | null,
  descriptionTranslation?: ContentLanguage | null,
): CategoryResponseDto {
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
