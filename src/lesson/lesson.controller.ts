import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LessonService } from './lesson.service';
import { LessonDto } from './dto/lesson.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('create/:sectionId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './public/uploads/videos',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @Auth('INSTRUCTOR')
  async createLesson(
    @Body() lessonDto: LessonDto,
    @UploadedFile() video: Express.Multer.File,
    @Param('sectionId') sectionId: string,
  ) {
    const videoUrl = `/uploads/images/${video.fieldname}`;
    return this.lessonService.createLesson(lessonDto, videoUrl, +sectionId);
  }

  @Get('get-all/:sectionId')
  async getAll(@Param('sectionId') sectionId: string) {
    return this.lessonService.getAll(+sectionId);
  }

  @Get('delete/:lessonId')
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return this.lessonService.deleteLesson(+lessonId);
  }

  @Patch('update/:lessonId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './public/uploads/videos',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @Auth('INSTRUCTOR')
  async updateLesson(
    @Body() lessonDto: LessonDto,
    @Param('lessonId') lessonId: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    const videoUrl = `/uploads/videos/${video.fieldname}`;
    return this.lessonService.updateLesson(lessonDto, videoUrl, +lessonId);
  }
}
