import { IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}
