import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonDto } from './dto/lesson.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createLesson(
    lessonDto: LessonDto,
    video: string,
    sectionId: number,
    duration: number,
  ) {
    const lessonsCount = await this.prismaService.lesson.aggregate({
      where: { sectionId },
      _count: true,
    });

    const section = await this.prismaService.section.findUnique({
      where: { id: sectionId },
    });

    const lesson = await this.prismaService.lesson.create({
      data: {
        ...lessonDto,
        video,
        sectionId,
        orderIndex: lessonsCount._count + 1,
        duration,
      },
    });

    await this.updateCourseStats(section.courseId, sectionId);
    return lesson;
  }

  async getAll(sectionId: number) {
    return await this.prismaService.lesson.findMany({ where: { sectionId } });
  }

  async getLessonById(lessonId: number, slug: string, userId: string) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    await this.prismaService.enrollement.update({
      where: { userId_courseId: { userId, courseId: course.id } },
      data: { currentLessonId: lessonId },
    });
    return lesson;
  }

  async getCurrentLessonBySlug(slug: string, userId: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    const enrollment = await this.prismaService.enrollement.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    return await this.prismaService.lesson.findUnique({
      where: { id: enrollment.currentLessonId },
    });
  }

  async lessonCompleted(lessonId: number, userId: string) {
    return this.prismaService.lessonProgress.create({
      data: { userId, lessonId },
    });
  }

  async deleteLesson(lessonId: number) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });
    if (lesson.video) {
      await this.supabaseService.deleteVideo(lesson.video);
    }
    const deletedLesson = await this.prismaService.lesson.delete({
      where: { id: lessonId },
    });

    const section = await this.prismaService.section.findUnique({
      where: { id: lesson.sectionId },
    });

    await this.updateCourseStats(section.courseId, section.id);
    return deletedLesson;
  }

  async reorderLesson(lessons: { id: number; orderIndex: number }[]) {
    return this.prismaService.$transaction(
      lessons.map((lesson) =>
        this.prismaService.lesson.update({
          where: { id: lesson.id },
          data: { orderIndex: lesson.orderIndex },
        }),
      ),
    );
  }

  async updateLesson(
    lessonDto: LessonDto,
    video: Express.Multer.File,
    lessonId: number,
    duration: number,
  ) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });

    const videoUrl = video
      ? await this.supabaseService.uploadVideo(video)
      : undefined;

    if (videoUrl) {
      await this.supabaseService.deleteVideo(lesson.video);
    }

    if (!videoUrl) {
      return await this.prismaService.lesson.update({
        where: { id: lessonId },
        data: { ...lessonDto, duration: lesson.duration, video: lesson.video },
      });
    }
    const updatedLesson = await this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lessonDto, duration, video: videoUrl },
    });

    const section = await this.prismaService.section.findUnique({
      where: { id: updatedLesson.sectionId },
      select: { courseId: true, id: true },
    });

    await this.updateCourseStats(section.courseId, section.id);
    return updatedLesson;
  }

  async updateCourseStats(courseId: number, sectionId: number) {
    const sectionAggregate = await this.prismaService.lesson.aggregate({
      where: { sectionId: sectionId },
      _sum: { duration: true },
      _count: { id: true },
    });

    const sectionDuration = sectionAggregate._sum.duration || 0;
    const sectionLessonsCount = sectionAggregate._count.id || 0;

    await this.prismaService.section.update({
      where: { id: sectionId },
      data: {
        totalDuration: sectionDuration,
        lessonsCount: sectionLessonsCount,
      },
    });

    const courseAggregate = await this.prismaService.section.aggregate({
      where: { courseId },
      _sum: {
        totalDuration: true,
        lessonsCount: true,
      },
    });

    const totalDuration = courseAggregate._sum.totalDuration || 0;
    const totalLessons = courseAggregate._sum.lessonsCount || 0;

    await this.prismaService.course.update({
      where: { id: courseId },
      data: {
        totalDuration: totalDuration,
        totalLessons: totalLessons,
      },
    });
  }
}
