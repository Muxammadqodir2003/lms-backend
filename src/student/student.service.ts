import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async enrollCourse(courseId: number, userId: string) {
    let enrollment = await this.prismaService.enrollement.findUnique({
      where: { userId_courseId: { courseId, userId } },
    });

    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
      include: { sections: { include: { lessons: true } } },
    });

    if (enrollment)
      throw new BadRequestException("Siz bu kursga allaqachon qo'shilgansiz");

    enrollment = await this.prismaService.enrollement.create({
      data: {
        courseId,
        userId,
        currentLessonId: course.sections[0].lessons[0].id,
      },
    });
    return enrollment;
  }

  async getCourse(slug: string) {
    return await this.prismaService.course.findUnique({ where: { slug } });
  }

  async getEnrolledCourses(userId: string) {
    return await this.prismaService.enrollement.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  async paidCourse() {}
}
