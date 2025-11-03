import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from '@src/common/dtos/files';
import { Public, ResponseMessage } from '@src/decorator/customize';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('/upload')
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload một file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileUpload: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Custom header for folder type',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload file thành công',
    type: FileUploadResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    return await this.filesService.uploadFile(file);
  }

  /**
   * Upload single image
   */
  @Public()
  @Post('/upload-single-image')
  @ResponseMessage('Upload Single Image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload một ảnh' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Custom header for folder type',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload single image thành công',
    type: FileUploadResponseDto,
  })
  async uploadSingleImage(
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<FileUploadResponseDto> {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    const folderType = req?.headers?.folder_type || 'images';
    const folderPath = `uploads/${folderType}`;

    return await this.filesService.uploadSingleImage(image, folderPath);
  }

  /**
   * Upload multiple images
   */
  @Public()
  @Post('/upload-multiple-images')
  @ResponseMessage('Upload Multiple Images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload nhiều ảnh (tối đa 10 ảnh)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files (jpg, jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Custom header for folder type',
  })
  async uploadMultipleImages(
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req,
  ): Promise<FileUploadResponseDto[]> {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    // Get folder path from header or use default
    const folderType = req?.headers?.folder_type || 'images';
    const folderPath = `uploads/${folderType}`;

    const results = await this.filesService.uploadMultipleImages(
      images,
      folderPath,
    );
    return results.files;
  }
}
