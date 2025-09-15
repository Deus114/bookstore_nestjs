import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { Public, ResponseMessage } from '@src/decorator/customize';
import { FilesService } from './files.service';
import { FileUploadResponseDto } from '@src/common/dtos/files';

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('/upload')
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @ApiConsumes('multipart/form-data')
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
    required: true,
    description: 'Custom header',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    return await this.filesService.uploadFile(file);
  }
}
