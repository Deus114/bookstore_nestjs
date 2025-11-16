import { ApiProperty } from '@nestjs/swagger';
import { EntityId } from '@src/common/utils/types';
import { Expose } from 'class-transformer';

export class UserAddressResponseDto {
  @ApiProperty({ description: 'Address ID' })
  @Expose()
  id: EntityId;

  @ApiProperty({ description: 'Name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Phone' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Address' })
  @Expose()
  address: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @Expose()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @Expose()
  longitude?: number;

  @ApiProperty({ description: 'Is default address' })
  @Expose()
  isDefault: boolean;

  @ApiProperty({ description: 'Created date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Expose()
  updatedAt: Date;
}
