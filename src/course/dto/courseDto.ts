import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CourseDto {
  @ApiProperty({ example: 'test-slug' })
  @IsString()
  @MinLength(5)
  slug: string;

  @ApiProperty({ example: 'Title' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Subtitle' })
  @IsString()
  @MinLength(5)
  subTitle: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsString()
  whatsLearn: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsString()
  requirements: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsString()
  tags: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({ example: 'Beginner' })
  @IsString()
  level: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  category: string;

  @ApiProperty({ example: '10' })
  @IsString()
  price: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  language: string;
}
