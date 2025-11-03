import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { IStorage } from './storage';

/**
 * S3 Storage Implementation
 */
export class S3Storage implements IStorage {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private endpoint: string;

  constructor(config?: {
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
  }) {
    // Nếu không có config thì sẽ dùng từ environment variables
    this.bucket =
      config?.bucket || process.env.STORAGE_BUCKET?.replace('s3://', '') || '';
    this.region = config?.region || process.env.AWS_REGION || 'ap-southeast-1';
    this.endpoint =
      config?.endpoint ||
      process.env.AWS_S3_ENDPOINT ||
      'https://s3.amazonaws.com';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey:
          config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      endpoint: this.endpoint,
      forcePathStyle: false,
    });
  }

  /**
   * Upload single file to S3
   */
  async upload(
    path: string,
    file: Buffer | Express.Multer.File,
    contentType?: string,
  ): Promise<string> {
    const buffer = Buffer.isBuffer(file) ? file : file.buffer;
    const mimeType =
      contentType ||
      (file as Express.Multer.File).mimetype ||
      'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: buffer,
      ContentType: mimeType,
      // ACL removed - use bucket policy instead for better security
    });

    try {
      await this.s3Client.send(command);
      return path;
    } catch (error: any) {
      throw new Error(
        `Failed to upload file to S3: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Upload multiple files to S3
   */
  async uploadMultiple(
    path: string,
    files: Array<Buffer | Express.Multer.File>,
    contentType?: string,
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const filePath =
        files.length === 1 ? path : `${path}/${Date.now()}-${index}`;

      return this.upload(filePath, file, contentType);
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete file from S3
   */
  async delete(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    try {
      await this.s3Client.send(command);
    } catch (error: any) {
      throw new Error(
        `Failed to delete file from S3: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Get full URL of file
   */
  getUrl(path: string): string {
    // Remove s3:// prefix if exists
    const cleanBucket = this.bucket.replace('s3://', '');

    // Construct URL based on endpoint
    if (this.endpoint.includes('amazonaws.com')) {
      return `https://${cleanBucket}.s3.${this.region}.amazonaws.com/${path}`;
    } else {
      // Custom endpoint
      return `${this.endpoint}/${cleanBucket}/${path}`;
    }
  }
}
