import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EntityId } from '@src/common/utils/types';

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

  @ApiProperty({ description: 'Latitude' })
  @Expose()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @Expose()
  longitude: number;

  @ApiProperty({ description: 'Is default address' })
  @Expose()
  isDefault: boolean;
}

