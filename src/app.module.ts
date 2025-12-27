import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { LessonModule } from './lesson/lesson.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRoot({
      options: { host: '127.0.0.1', port: 6379 },
      type: 'single',
    }),
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
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
