import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstructorDto {
  @ApiProperty({ example: 'John' })
  @MinLength(3, { message: "Ism kamida 3 harf dan iborat bo'lishi kerak" })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @MinLength(3, { message: "Familiya kamida 3 harf dan iborat bo'lishi kerak" })
  lastName: string;

  @ApiProperty({ example: 'Teacher' })
  @IsString({
    message: "Ish matn malumot turidan tashkil topgan bo'lishi kerak",
  })
  job: string;

  @ApiProperty({ example: 'English' })
  @IsString({
    message: "Ish matn malumot turidan tashkil topgan bo'lishi kerak",
  })
  language: string;

  @ApiProperty({ example: 'https://github.com/username' })
  @MinLength(5, { message: 'Yaroqli havola kiriting' })
  social: string;
}
