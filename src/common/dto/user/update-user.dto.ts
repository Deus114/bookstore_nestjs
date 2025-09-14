import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'id không được để trống', })
    id: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để trống', })
    fullName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Sđt không được để trống', })
    phone: string;
}