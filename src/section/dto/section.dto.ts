import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty({ example: 'Section Name' })
  @IsString()
  name: string;
}
