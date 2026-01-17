import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { VideoService } from 'src/common/video.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, VideoService, SupabaseService],
})
export class LessonModule {}
