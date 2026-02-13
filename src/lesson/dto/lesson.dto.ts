import { Optional } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LessonDto {
  @ApiProperty({ example: 'Lesson Name' })
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'Lesson Description' })
  @Optional()
  @IsString()
  description: string;
}
