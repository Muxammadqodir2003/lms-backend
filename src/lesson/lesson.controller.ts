import {
  Body,
  Controller,
  Delete,
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
import { VideoService } from 'src/common/video.service';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly videoService: VideoService,
  ) {}

  @Post('create/:sectionId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: 'public/uploads/videos',
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
    const videoUrl = `public/uploads/videos/${video.filename}`;
    const duration = await this.videoService.getVideoDuration(video.path);
    return await this.lessonService.createLesson(
      lessonDto,
      videoUrl,
      +sectionId,
      duration as number,
    );
  }

  @Get('get-all/:sectionId')
  async getAll(@Param('sectionId') sectionId: string) {
    return await this.lessonService.getAll(+sectionId);
  }

  @Delete('delete/:lessonId')
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return await this.lessonService.deleteLesson(+lessonId);
  }

  @Patch('update/:lessonId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: 'public/uploads/videos',
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
    @UploadedFile() video?: Express.Multer.File,
  ) {
    const videoUrl = video
      ? `public/uploads/videos/${video.filename}`
      : undefined;
    let duration = 0;
    if (video) {
      duration = (await this.videoService.getVideoDuration(
        video.path,
      )) as number;
    }
    return await this.lessonService.updateLesson(
      lessonDto,
      videoUrl,
      +lessonId,
      duration,
    );
  }

  @Auth('INSTRUCTOR')
  @Patch('reorder')
  async reorderLesson(
    @Body() dto: { lessons: { id: number; orderIndex: number }[] },
  ) {
    return await this.lessonService.reorderLesson(dto.lessons);
  }
}
