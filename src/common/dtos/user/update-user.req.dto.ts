import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EntityId } from '@src/common/utils/types';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'id không được để trống' })
  id: EntityId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Sđt không được để trống' })
  phone: string;
}
