import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SectionDto } from './dto/section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @HttpCode(201)
  @Post('create/:id')
  @Auth('INSTRUCTOR')
  async create(@Body() sectionDto: SectionDto, @Param('id') id: number) {
    return this.sectionService.create(sectionDto, id);
  }

  @HttpCode(200)
  @Get('get-all/:courseId')
  @Auth('INSTRUCTOR')
  async getAll(@Param('courseId') courseId: string) {
    return await this.sectionService.getAll(+courseId);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  @Auth('INSTRUCTOR')
  async delete(@Param('id') id: string) {
    return await this.sectionService.delete(+id);
  }

  @HttpCode(200)
  @Patch('update/:id')
  @Auth('INSTRUCTOR')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.sectionService.update(+id, body.name);
  }
}
