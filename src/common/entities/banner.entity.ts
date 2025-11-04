import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('banners')
export class Banner extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  sortOrder: number;
}
