import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { OrderPaymentType } from '../../utils/enums';
import { OrderDetailDto } from './order-detail.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User Id không được để trống' })
  userId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ enum: OrderPaymentType })
  @IsNotEmpty({ message: 'PTTT không được để trống' })
  @IsEnum(OrderPaymentType, { message: 'Loại thanh toán không hợp lệ' })
  type: OrderPaymentType;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tổng tiền không được để trống' })
  totalPrice: number;

  @IsArray()
  @ValidateNested()
  @Type(() => OrderDetailDto)
  @ApiProperty({ type: [OrderDetailDto] })
  @IsNotEmpty({ message: 'Chi tiết đơn hàng không được để trống' })
  orderDetails: OrderDetailDto[];
}
