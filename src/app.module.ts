import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { LessonModule } from './lesson/lesson.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SupabaseService } from './supabase/supabase.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './redis/redis.module';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000,
            limit: 10,
          },
        ],
        errorMessage: 'Too many requests. Please try again after a minute.',
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            tls: {
              rejectUnauthorized: false,
            },
            retryStrategy(times) {
              return Math.min(times * 50, 2000);
            },
          }),
        ),
      }),
    }),
    RedisModule,
    AuthModule,
    TokenModule,
    MailModule,
    StudentModule,
    AdminModule,
    InstructorModule,
    CourseModule,
    SectionModule,
    LessonModule,
    PrismaModule,
    RedisModule,
    CommentModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    SupabaseService,
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
  ],
})
export class AppModule {}
