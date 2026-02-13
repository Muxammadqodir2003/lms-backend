import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'Yaroqli email manzili kiriting' })
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  password: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  otp: number;
}
