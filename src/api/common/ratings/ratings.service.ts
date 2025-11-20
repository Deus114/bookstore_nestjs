import { ForbiddenException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  CreateRatingDto,
  RatingResponseDto,
  UpdateRatingDto,
} from '@src/common/dtos/rating';
import { Rating } from '@src/common/entities';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { BookRepositoryService } from '@src/common/repositories/book';
import { RatingRepositoryService } from '@src/common/repositories/rating';
import { RatingResource, RatingsResource } from '@src/common/resources/rating';
import { UserRole } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';

@Injectable()
export class RatingsService {
  constructor(
    private ratingRepositoryService: RatingRepositoryService,
    private bookRepositoryService: BookRepositoryService,
  ) {}

  async create(
    createRatingDto: CreateRatingDto,
    user: IUser,
  ): Promise<RatingResponseDto> {
    // Kiểm tra sách có tồn tại không
    const book = await this.bookRepositoryService.findOne(
      createRatingDto.bookId,
    );
    if (!book) {
      throw new NotFoundBusinessException('BOOK_NOT_FOUND');
    }

    // Kiểm tra user đã đánh giá sách này chưa
    const existingRating =
      await this.ratingRepositoryService.findByBookIdAndUserId(
        createRatingDto.bookId,
        user.id as EntityId,
      );

    if (existingRating) {
      throw new BadRequestBusinessException('RATING_ALREADY_EXISTS');
    }

    // Tạo rating mới
    const newRating = new Rating();
    newRating.book = { id: createRatingDto.bookId } as any;
    newRating.user = { id: user.id } as any;
    newRating.rating = createRatingDto.rating;
    newRating.comment = createRatingDto.comment;
    newRating.images = createRatingDto.images || [];
    newRating.createdBy = user.id as string;
    newRating.updatedBy = user.id as string;

    const savedRating = await this.ratingRepositoryService.create(newRating);

    // Reload để lấy đầy đủ thông tin
    const rating = await this.ratingRepositoryService.findOne(savedRating.id, [
      'book',
      'user',
    ]);

    return RatingResource(rating);
  }

  async findAll(
    currentPage: number,
    limit: number,
    rating?: number,
    comment?: string,
  ): Promise<PaginatedResponseDto<RatingResponseDto>> {
    const queryBuilder = this.ratingRepositoryService.getQueryBuilder();

    // Load relations
    queryBuilder.leftJoinAndSelect('rating.book', 'book');
    queryBuilder.leftJoinAndSelect('rating.user', 'user');

    // Filter theo rating
    if (rating && rating !== null) {
      queryBuilder.andWhere('rating.rating = :rating', { rating });
    }

    // Filter theo comment (tìm kiếm trong comment)
    if (comment) {
      queryBuilder.andWhere('unaccent(rating.comment) ILIKE :comment', {
        comment: '%' + comment + '%',
      });
    }

    // Sắp xếp theo thời gian tạo mới nhất
    queryBuilder.orderBy('rating.createdAt', 'DESC');

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      RatingsResource(result),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findAllByBook(
    bookId: EntityId,
    currentPage: number,
    limit: number,
    rating?: number,
    comment?: string,
  ): Promise<PaginatedResponseDto<RatingResponseDto>> {
    // Kiểm tra sách có tồn tại không
    const book = await this.bookRepositoryService.findOne(bookId);
    if (!book) {
      throw new NotFoundBusinessException('BOOK_NOT_FOUND');
    }

    const queryBuilder = this.ratingRepositoryService.getQueryBuilder();

    // Filter theo bookId
    queryBuilder.where('rating.bookId = :bookId', { bookId });

    // Load relations
    queryBuilder.leftJoinAndSelect('rating.book', 'book');
    queryBuilder.leftJoinAndSelect('rating.user', 'user');

    // Filter theo rating
    if (rating && rating !== null) {
      queryBuilder.andWhere('rating.rating = :rating', { rating });
    }

    // Filter theo comment (tìm kiếm trong comment)
    if (comment) {
      queryBuilder.andWhere('unaccent(rating.comment) ILIKE :comment', {
        comment: '%' + comment + '%',
      });
    }

    // Sắp xếp theo thời gian tạo mới nhất
    queryBuilder.orderBy('rating.createdAt', 'DESC');

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      RatingsResource(result),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findOne(id: EntityId): Promise<RatingResponseDto> {
    const rating = await this.ratingRepositoryService.findOne(id, [
      'book',
      'user',
    ]);

    if (!rating) {
      throw new NotFoundBusinessException('RATING_NOT_FOUND');
    }

    return RatingResource(rating);
  }

  async update(
    id: EntityId,
    updateRatingDto: UpdateRatingDto,
    user: IUser,
  ): Promise<RatingResponseDto> {
    // Lấy rating hiện tại
    const rating = await this.ratingRepositoryService.findOne(id, ['user']);

    if (!rating) {
      throw new NotFoundBusinessException('RATING_NOT_FOUND');
    }

    // Kiểm tra quyền: chỉ người đăng mới có quyền chỉnh sửa
    if (rating.user.id !== (user.id as EntityId)) {
      throw new ForbiddenException('FORBIDDEN_UPDATE_RATING');
    }

    // Cập nhật các trường
    if (updateRatingDto.rating) {
      rating.rating = updateRatingDto.rating;
    }
    if (updateRatingDto.comment) {
      rating.comment = updateRatingDto.comment;
    }
    if (updateRatingDto.images) {
      rating.images = updateRatingDto.images;
    }
    rating.updatedBy = user.id as string;

    const updatedRating = await this.ratingRepositoryService.update(rating);

    // Reload để lấy đầy đủ thông tin
    const finalRating = await this.ratingRepositoryService.findOne(
      updatedRating.id,
      ['book', 'user'],
    );

    return RatingResource(finalRating!);
  }

  async delete(id: EntityId, user: IUser): Promise<void> {
    // Lấy rating hiện tại
    const rating = await this.ratingRepositoryService.findOne(id, ['user']);

    if (!rating) {
      throw new NotFoundBusinessException('RATING_NOT_FOUND');
    }

    // Kiểm tra quyền: chỉ chủ bình luận hoặc admin mới có quyền xóa
    const isOwner = rating.user.id === (user.id as EntityId);
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('FORBIDDEN_DELETE_RATING');
    }

    await this.ratingRepositoryService.delete(id);
  }
}
