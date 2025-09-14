import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('content_language')
export class ContentLanguage extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  key: string;

  @Column({ type: 'text', nullable: false, default: '' })
  @IsString()
  content: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  language: string;
}
