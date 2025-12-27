import { IsEmail, IsString, MinLength } from 'class-validator';

export class InstructorDto {
  @MinLength(3, { message: "Ism kamida 3 harf dan iborat bo'lishi kerak" })
  firstName: string;

  @MinLength(3, { message: "Ism kamida 3 harf dan iborat bo'lishi kerak" })
  lastName: string;

  @IsString({
    message: "Ish matn malumot turidan tashkil topgan bo'lishi kerak",
  })
  job: string;

  @IsString({
    message: "Ish matn malumot turidan tashkil topgan bo'lishi kerak",
  })
  language: string;

  @MinLength(5, { message: 'Yaroqli havola kiriting' })
  social: string;
}
