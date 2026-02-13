import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty({ example: 'Test comment' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number;
}
