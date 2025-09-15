import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@gmail.com | admin@gmail.com' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;
}
