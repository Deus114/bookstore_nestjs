import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { EntityId } from '../utils/types';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('rowid') id: EntityId;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  deletedBy?: string;

  generateUUID(): string {
    return uuidv4();
  }

  generateDateNow(): Date {
    return new Date();
  }

  generatePasswordHash(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}
