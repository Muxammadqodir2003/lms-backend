import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { VideoService } from 'src/common/video.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, VideoService],
})
export class LessonModule {}
