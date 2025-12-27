import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(lessonDto: LessonDto, video: string, sectionId: number) {
    return await this.prismaService.lesson.create({
      data: { ...lessonDto, video, sectionId },
    });
  }

  async getAll(sectionId: number) {
    return this.prismaService.lesson.findMany({ where: { sectionId } });
  }

  async deleteLesson(lessonId: number) {
    return this.prismaService.lesson.delete({ where: { id: lessonId } });
  }

  async updateLesson(lessonDto: LessonDto, video: string, lessonId: number) {
    return await this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lessonDto, video },
    });
  }
}
