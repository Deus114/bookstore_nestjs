export * from './functions.helper';
export * from './pagination.helper';

/**
 * Remove Vietnamese accents from a string
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}
