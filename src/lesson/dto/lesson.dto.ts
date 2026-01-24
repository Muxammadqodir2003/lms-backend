import { Optional } from '@nestjs/common';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class LessonDto {
  @MinLength(3)
  name: string;

  @Optional()
  @IsString()
  description: string;
}
