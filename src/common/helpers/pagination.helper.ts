import { SelectQueryBuilder } from 'typeorm';
import { PaginatedResponseDto } from '@src/common/dtos/common';

export interface PaginationOptions {
  currentPage?: number;
  pageSize?: number;
  defaultLimit?: number;
}

export interface PaginationResult<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

/**
 * Helper function to handle pagination for TypeORM QueryBuilder
 * @param queryBuilder - TypeORM SelectQueryBuilder instance
 * @param options - Pagination options
 * @returns Pagination metadata (offset, limit, totalItems, totalPages)
 */
export async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions = {},
): Promise<{
  offset: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}> {
  const { currentPage = 1, pageSize = 10, defaultLimit = 10 } = options;

  // Calculate pagination
  const limit = +pageSize || defaultLimit;
  const offset = (+currentPage - 1) * limit;

  // Get total items
  const totalItems = await queryBuilder.getCount();

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  return {
    offset,
    limit,
    totalItems,
    totalPages,
  };
}

/**
 * Helper function to build paginated response
 * @param data - Array of data items
 * @param totalItems - Total number of items
 * @param currentPage - Current page number
 * @param pageSize - Page size
 * @returns PaginatedResponseDto
 */
export function buildPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  pageSize: number,
): PaginatedResponseDto<T> {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    meta: {
      current: currentPage,
      pageSize: pageSize,
      pages: totalPages,
      total: totalItems,
    },
    result: data,
  };
}

/**
 * Helper function to handle pagination for array of items (client-side pagination)
 * @param items - Array of items
 * @param currentPage - Current page number
 * @param pageSize - Page size (can be 'all' to return all items)
 * @returns Paginated data with metadata
 */
export function paginateArray<T>(
  items: T[],
  currentPage: number = 1,
  pageSize: number | string = 10,
): {
  data: T[];
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
} {
  const totalItems = items.length;
  let limit: number;
  let paginatedItems: T[];

  if (pageSize === 'all' || pageSize === 'ALL') {
    limit = totalItems;
    paginatedItems = items;
  } else {
    limit = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize;
    const offset = (currentPage - 1) * limit;
    paginatedItems = items.slice(offset, offset + limit);
  }

  const totalPages = limit > 0 ? Math.ceil(totalItems / limit) : 1;

  return {
    data: paginatedItems,
    meta: {
      current: currentPage,
      pageSize: limit,
      pages: totalPages,
      total: totalItems,
    },
  };
}
