import { plainToClass } from 'class-transformer';
import { RatingResponseDto } from '../dtos/rating';
import { Rating } from '../entities';

export function RatingsResource(ratings: Rating[]): RatingResponseDto[] {
  return ratings && ratings.length
    ? ratings.map((rating) => RatingResource(rating))
    : [];
}

export function RatingResource(rating: Rating): RatingResponseDto {
  const ratingDto = plainToClass(RatingResponseDto, rating, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  // Map bookId và userId từ relations nếu có
  if (rating.book && rating.book.id) {
    ratingDto.bookId = rating.book.id;
  } else if ((rating as any).bookId) {
    ratingDto.bookId = (rating as any).bookId;
  }

  if (rating.user && rating.user.id) {
    ratingDto.userId = rating.user.id;
  } else if ((rating as any).userId) {
    ratingDto.userId = (rating as any).userId;
  }

  return ratingDto;
}
