import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Uploaded file name' })
  @Expose()
  fileName: string;

  @ApiProperty({ description: 'File path on storage', required: false })
  @Expose()
  path?: string;

  @ApiProperty({ description: 'Full URL to access the file', required: false })
  @Expose()
  url?: string;
}
