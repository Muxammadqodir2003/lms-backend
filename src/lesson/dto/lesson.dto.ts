import { IsNumber, IsString, MinLength } from 'class-validator';

export class LessonDto {
  @MinLength(3)
  name: string;

  @IsNumber()
  duration: number;

  @IsString()
  description?: string;
}
