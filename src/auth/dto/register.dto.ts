import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Yaroqli email manzili kiriting' })
  email: string;

  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  password: string;

  @MinLength(6)
  otp: number;
}
