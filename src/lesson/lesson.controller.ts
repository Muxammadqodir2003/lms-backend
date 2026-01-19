import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LessonService } from './lesson.service';
import { LessonDto } from './dto/lesson.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { VideoService } from 'src/common/video.service';
import { User } from 'src/auth/decorators/user.decorator';
import { SupabaseService } from 'src/supabase/supabase.service';
import { diskStorage } from 'multer';
import * as fs from 'fs/promises';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly videoService: VideoService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('create/:sectionId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: 'public/uploads/videos',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 100 },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('video/')) {
          return cb(
            new BadRequestException('Only video files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Auth('INSTRUCTOR')
  async createLesson(
    @Body() lessonDto: LessonDto,
    @UploadedFile() video: Express.Multer.File,
    @Param('sectionId') sectionId: string,
  ) {
    const duration = await this.videoService.getVideoDuration(video.path);
    const videoUrl = await this.supabaseService.uploadVideo(video);
    await fs.unlink(video.path);

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
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 100 },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('video/')) {
          return cb(
            new BadRequestException('Only video files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Auth('INSTRUCTOR')
  async updateLesson(
    @Body() lessonDto: LessonDto,
    @Param('lessonId') lessonId: string,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    let duration = 0;
    if (video) {
      duration = (await this.videoService.getVideoDuration(
        video.path,
      )) as number;
    }
    return await this.lessonService.updateLesson(
      lessonDto,
      video,
      +lessonId,
      duration,
    );
  }

  @HttpCode(204)
  @Auth('INSTRUCTOR')
  @Patch('reorder')
  async reorderLesson(
    @Body() dto: { lessons: { id: number; orderIndex: number }[] },
  ) {
    return await this.lessonService.reorderLesson(dto.lessons);
  }

  @HttpCode(200)
  @Auth('STUDENT')
  @Get('get-by-id/:lessonId')
  async getLessonById(
    @User('id') userId: string,
    @Param('lessonId') lessonId: string,
    @Query('slug') slug: string,
  ) {
    return await this.lessonService.getLessonById(+lessonId, slug, userId);
  }

  @HttpCode(200)
  @Auth('STUDENT')
  @Get('get-current-lesson-by-slug/:slug')
  async getCurrentLessonBySlug(
    @Param('slug') slug: string,
    @User('id') userId: string,
  ) {
    return await this.lessonService.getCurrentLessonBySlug(slug, userId);
  }

  @HttpCode(200)
  @Auth('STUDENT')
  @Post('completed/:lessonId')
  async lessonCompleted(
    @Param('lessonId') lessonId: string,
    @User('id') userId: string,
  ) {
    return await this.lessonService.lessonCompleted(+lessonId, userId);
  }
}
