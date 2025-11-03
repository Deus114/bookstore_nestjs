import { Injectable, OnModuleInit } from '@nestjs/common';
import { StorageFactory, IStorage } from './storage';

/**
 * Storage Service
 * NestJS service để inject storage instance
 * Đọc config trực tiếp từ environment variables
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private storage: IStorage;

  constructor() {}

  onModuleInit() {
    // Initialize storage với config từ environment variables
    const storageType = (process.env.STORAGE_TYPE || 's3') as 's3' | 'local';

    this.storage = StorageFactory.create(storageType, {
      bucket: process.env.STORAGE_BUCKET?.replace('s3://', ''),
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT,
    });
  }

  /**
   * Get storage instance
   */
  getStorage(): IStorage {
    return this.storage;
  }

  /**
   * Upload single file
   */
  async upload(
    path: string,
    file: Buffer | Express.Multer.File,
    contentType?: string,
  ): Promise<string> {
    return this.storage.upload(path, file, contentType);
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    path: string,
    files: Array<Buffer | Express.Multer.File>,
    contentType?: string,
  ): Promise<string[]> {
    return this.storage.uploadMultiple(path, files, contentType);
  }

  /**
   * Delete file
   */
  async delete(path: string): Promise<void> {
    return this.storage.delete(path);
  }

  /**
   * Get file URL
   */
  getUrl(path: string): string {
    return this.storage.getUrl(path);
  }
}
