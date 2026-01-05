import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(
    lessonDto: LessonDto,
    video: string,
    sectionId: number,
    duration: number,
  ) {
    const section = await this.prismaService.section.findUnique({
      where: { id: sectionId },
      include: { lessons: true },
    });
    return await this.prismaService.lesson.create({
      data: {
        ...lessonDto,
        video,
        sectionId,
        orderIndex: section.lessons.length + 1,
        duration,
      },
    });
  }

  async getAll(sectionId: number) {
    return this.prismaService.lesson.findMany({ where: { sectionId } });
  }

  async deleteLesson(lessonId: number) {
    return this.prismaService.lesson.delete({ where: { id: lessonId } });
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
    video: string,
    lessonId: number,
    duration: number,
  ) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!video) {
      return await this.prismaService.lesson.update({
        where: { id: lessonId },
        data: { ...lessonDto, duration: lesson.duration, video: lesson.video },
      });
    }
    return await this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lessonDto, duration: duration, video },
    });
  }
}
