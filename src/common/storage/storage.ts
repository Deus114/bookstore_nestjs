import { S3Storage } from './storage.s3';

/**
 * Storage Interface
 * Define interface cho storage operations
 */
export interface IStorage {
  upload(
    path: string,
    file: Buffer | Express.Multer.File,
    contentType?: string,
  ): Promise<string>;

  uploadMultiple(
    path: string,
    files: Array<Buffer | Express.Multer.File>,
    contentType?: string,
  ): Promise<string[]>;

  delete(path: string): Promise<void>;

  getUrl(path: string): string;
}

/**
 * Storage Factory
 * Factory để tạo storage instance dựa trên config
 */
export class StorageFactory {
  static create(type: 's3' | 'local' = 's3', config?: any): IStorage {
    switch (type) {
      case 's3':
        return new S3Storage(config);
      case 'local':
        throw new Error('Local storage not implemented yet');
      default:
        throw new Error(`Storage type ${type} not supported`);
    }
  }
}
