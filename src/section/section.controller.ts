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
import { User } from 'src/auth/decorators/user.decorator';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @HttpCode(201)
  @Post('create/:slug')
  @Auth('INSTRUCTOR')
  async create(@Body() sectionDto: SectionDto, @Param('slug') slug: string) {
    console.log(slug);
    return this.sectionService.create(sectionDto, slug);
  }

  @HttpCode(200)
  @Get('get-all/:slug')
  @Auth('INSTRUCTOR')
  async getAll(@Param('slug') slug: string) {
    return await this.sectionService.getAll(slug);
  }

  @HttpCode(200)
  @Delete('delete/:sectionId')
  @Auth('INSTRUCTOR')
  async delete(@Param('sectionId') sectionId: string) {
    return await this.sectionService.delete(+sectionId);
  }

  @HttpCode(200)
  @Patch('update/:sectionId')
  @Auth('INSTRUCTOR')
  async update(
    @Param('sectionId') sectionId: string,
    @Body() body: { name: string },
  ) {
    return await this.sectionService.update(+sectionId, body.name);
  }

  @HttpCode(200)
  @Patch('reorder')
  @Auth('INSTRUCTOR')
  async reorder(
    @Body() dto: { sections: { id: number; orderIndex: number }[] },
  ) {
    return await this.sectionService.reorder(dto.sections);
  }

  @HttpCode(200)
  @Get('get-by-course-slug/:slug')
  @Auth('STUDENT')
  async getByCourseSlug(
    @User('id') userId: string,
    @Param('slug') slug: string,
  ) {
    console.log(userId, slug);
    return await this.sectionService.getByCourseSlug(slug, userId);
  }
}
