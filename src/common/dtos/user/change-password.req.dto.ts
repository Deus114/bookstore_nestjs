import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePassWorDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống', })
    oldpass: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống', })
    newpass: string;
}