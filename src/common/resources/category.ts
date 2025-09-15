import { plainToClass } from 'class-transformer';
import { Category } from '../entities';
import { CategoryResponseDto } from '../dtos/category';

export function CategoriesResource(
  categories: Category[],
): CategoryResponseDto[] {
  return categories && categories.length
    ? categories.map((category) => {
        return CategoryResource(category);
      })
    : [];
}

export function CategoryResource(category: Category): CategoryResponseDto {
  return plainToClass(CategoryResponseDto, category, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
