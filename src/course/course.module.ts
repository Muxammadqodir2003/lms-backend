import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService, SupabaseService, RedisService],
})
export class CourseModule {}
