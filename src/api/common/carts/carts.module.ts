import { Module } from '@nestjs/common';
import { BookRepositoryModule } from '@src/common/repositories/book';
import { CartRepositoryModule } from '@src/common/repositories/cart';
import { CartItemRepositoryModule } from '@src/common/repositories/cart-item';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  imports: [
    CartRepositoryModule,
    CartItemRepositoryModule,
    BookRepositoryModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
