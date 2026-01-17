import { IsString, MinLength } from 'class-validator';

export class CourseDto {
  @IsString()
  @MinLength(5)
  slug: string;

  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(5)
  subTitle: string;

  @IsString()
  whatsLearn: string;

  @IsString()
  requirements: string;

  @IsString()
  tags: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  level: string;

  @IsString()
  category: string;

  @IsString()
  price: string;

  @IsString()
  language: string;
}
