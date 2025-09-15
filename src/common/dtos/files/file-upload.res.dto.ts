import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Uploaded file name' })
  fileName: string;
}
