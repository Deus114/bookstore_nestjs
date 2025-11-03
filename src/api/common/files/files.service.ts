import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadResponseDto } from '@src/common/dtos/files';
import { getFullPathS3 } from '@src/common/helpers';
import { StorageService } from '@src/common/storage';
import {
  compressImage,
  compressImages,
  uploadFile,
  uploadFiles,
} from '@src/common/utils/files/upload-file';
import { plainToClass } from 'class-transformer';

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload single file to S3
   */
  async uploadFile(file: Express.Multer.File): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate image
    this.validateImage(file);

    // Compress image
    const compressedImage = await compressImage(file);

    // Upload to S3
    const imagePath = await uploadFile(
      'uploads/images',
      compressedImage,
      this.storageService.getStorage(),
      true,
    );

    const result = {
      fileName: file.originalname,
      path: imagePath,
      url: getFullPathS3(imagePath),
    };

    return plainToClass(FileUploadResponseDto, result, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }

  /**
   * Upload single image (optimized for images)
   */
  async uploadSingleImage(
    file: Express.Multer.File,
    folderPath?: string,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Validate image
    this.validateImage(file);

    // Compress image
    const compressedImage = await compressImage(file);

    // Upload to S3
    const imagePath = await uploadFile(
      folderPath || 'uploads/images',
      compressedImage,
      this.storageService.getStorage(),
      true,
    );

    const result = {
      fileName: file.originalname,
      path: imagePath,
      url: getFullPathS3(imagePath),
    };

    return plainToClass(FileUploadResponseDto, result, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    folderPath?: string,
  ): Promise<{ count: number; files: FileUploadResponseDto[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    // Validate all images
    files.forEach((file) => this.validateImage(file));

    // Compress all images
    const compressedImages = await compressImages(files);

    // Upload all to S3
    const imagePaths = await uploadFiles(
      folderPath || 'uploads/images',
      compressedImages,
      this.storageService.getStorage(),
      true,
    );

    const uploadedFiles = imagePaths.map((path, index) => ({
      fileName: files[index].originalname,
      path: path,
      url: getFullPathS3(path),
    }));

    return {
      count: uploadedFiles.length,
      files: uploadedFiles.map((file) =>
        plainToClass(FileUploadResponseDto, file, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        }),
      ),
    };
  }

  /**
   * Helper: Validate image
   */
  private validateImage(file: Express.Multer.File): void {
    // Check extension
    const ext = file.originalname
      .substring(file.originalname.lastIndexOf('.'))
      .toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `Invalid image type. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
      );
    }

    // Check size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        `Image too large. Max size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      );
    }
  }
}
