import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MaxLength(255, { message: 'Tên không được vượt quá 255 ký tự' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  @MaxLength(255, { message: 'Họ không được vượt quá 255 ký tự' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MaxLength(255, { message: 'Họ và tên không được vượt quá 255 ký tự' })
  fullName: string;

  @ApiProperty()
  @IsString({ message: 'Mã người dùng phải là chuỗi' })
  @MaxLength(50, { message: 'Mã người dùng không được vượt quá 50 ký tự' })
  code: string;

  @ApiProperty()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(50, { message: 'Số điện thoại không được vượt quá 50 ký tự' })
  phone?: string;

  @ApiProperty()
  @IsString({ message: 'Email phải là chuỗi' })
  @MaxLength(50, { message: 'Email không được vượt quá 50 ký tự' })
  email?: string;

  @ApiProperty()
  @IsString({ message: 'Ảnh đại diện phải là chuỗi' })
  @MaxLength(500, { message: 'Ảnh đại diện không được vượt quá 500 ký tự' })
  avatar?: string;

  @ApiProperty()
  dateOfBirth?: string;
}

export class UserDto extends CreateUserDto {}
