import sharp from 'sharp';
import { IStorage } from '@src/common/storage';

/**
 * Upload single file to storage
 * @param folderPath - Folder path on storage (e.g., 'users/123/images')
 * @param file - Multer file object
 * @param storage - Storage instance
 * @param rename - Whether to rename file with timestamp
 * @returns File path on storage
 */
export async function uploadFile(
  folderPath: string,
  file: Express.Multer.File,
  storage: IStorage,
  rename: boolean = true,
): Promise<string> {
  // Generate file path
  const timestamp = Date.now();
  const ext = file.originalname
    .substring(file.originalname.lastIndexOf('.'))
    .toLowerCase();
  const baseName = file.originalname
    .substring(0, file.originalname.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9]/g, '-');

  const fileName = rename
    ? `${timestamp}-${baseName}${ext}`
    : `${baseName}${ext}`;

  const filePath = `${folderPath}/${fileName}`;

  // Upload file
  await storage.upload(filePath, file, file.mimetype);

  return filePath;
}

/**
 * Upload multiple files to storage
 * @param folderPath - Folder path on storage
 * @param files - Array of Multer file objects
 * @param storage - Storage instance
 * @param rename - Whether to rename files with timestamp
 * @returns Array of file paths on storage
 */
export async function uploadFiles(
  folderPath: string,
  files: Express.Multer.File[],
  storage: IStorage,
  rename: boolean = true,
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now();
    const ext = file.originalname
      .substring(file.originalname.lastIndexOf('.'))
      .toLowerCase();
    const baseName = file.originalname
      .substring(0, file.originalname.lastIndexOf('.'))
      .replace(/[^a-zA-Z0-9]/g, '-');

    const fileName = rename
      ? `${timestamp}-${index}-${baseName}${ext}`
      : `${baseName}${ext}`;

    const filePath = `${folderPath}/${fileName}`;

    return storage.upload(filePath, file, file.mimetype).then(() => filePath);
  });

  return Promise.all(uploadPromises);
}

/**
 * Compress single image
 * @param file - Multer file object
 * @param quality - Compression quality (1-100), default 100
 * @returns Compressed file object
 */
export async function compressImage(
  file: Express.Multer.File,
  quality: number = 100,
): Promise<Express.Multer.File> {
  try {
    // Check if file is an image
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return file; // Return original if not image
    }

    let compressedBuffer: Buffer;
    const sharpInstance = sharp(file.buffer);

    // Compress based on image format
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      compressedBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
    } else if (file.mimetype === 'image/png') {
      compressedBuffer = await sharpInstance.png({ quality }).toBuffer();
    } else if (file.mimetype === 'image/webp') {
      compressedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    } else {
      // For other formats (gif, etc.), try to convert to jpeg
      compressedBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
    }

    // Create new file object with compressed buffer
    return {
      ...file,
      buffer: compressedBuffer,
      size: compressedBuffer.length,
    } as Express.Multer.File;
  } catch (error: any) {
    // If compression fails, return original file
    console.warn(
      'Image compression failed:',
      error?.message || 'Unknown error',
    );
    return file;
  }
}

/**
 * Compress multiple images
 * @param files - Array of Multer file objects
 * @param quality - Compression quality (1-100), default 80
 * @returns Array of compressed file objects
 */
export async function compressImages(
  files: Express.Multer.File[],
  quality: number = 80,
): Promise<Express.Multer.File[]> {
  return Promise.all(files.map((file) => compressImage(file, quality)));
}
