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
import { Auth } from 'src/common/decorators/auth.decorator';
import { SectionDto } from './dto/section.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Section')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create section' })
  @Post('create/:slug')
  @Auth('INSTRUCTOR')
  async create(@Body() sectionDto: SectionDto, @Param('slug') slug: string) {
    console.log(slug);
    return this.sectionService.create(sectionDto, slug);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sections' })
  @Get('get-all/:slug')
  @Auth('INSTRUCTOR')
  async getAll(@Param('slug') slug: string) {
    return await this.sectionService.getAll(slug);
  }

  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete section' })
  @Delete('delete/:sectionId')
  @Auth('INSTRUCTOR')
  async delete(@Param('sectionId') sectionId: string) {
    return await this.sectionService.delete(+sectionId);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update section' })
  @Patch('update/:sectionId')
  @Auth('INSTRUCTOR')
  async update(
    @Param('sectionId') sectionId: string,
    @Body() body: { name: string },
  ) {
    return await this.sectionService.update(+sectionId, body.name);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder section' })
  @Patch('reorder')
  @Auth('INSTRUCTOR')
  async reorder(
    @Body() dto: { sections: { id: number; orderIndex: number }[] },
  ) {
    return await this.sectionService.reorder(dto.sections);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get section by course slug' })
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
