import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FileUploadResponseDto } from '@src/common/dtos/files';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File): Promise<FileUploadResponseDto> {
    const result = {
      fileName: file.filename,
    };
    return plainToClass(FileUploadResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
