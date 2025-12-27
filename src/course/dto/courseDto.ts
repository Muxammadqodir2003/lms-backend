import { IsNumber, IsString, MinLength } from 'class-validator';

export class CourseDto {
  slug: string;

  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(5)
  subTitle: string;

  whatsLearn: string[];

  requirements: string[];

  tags: string[];

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  level: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsString()
  language: string;
}
