import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({ example: 'Title' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @ApiProperty({ example: 'Subtitle' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  subTitle?: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsOptional()
  @IsString()
  whatsLearn?: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'html, css, js' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ example: 'Description' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @ApiProperty({ example: 'Intermediate' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ example: 'IT' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: '10' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;
}
