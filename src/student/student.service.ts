import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async enrollCourse(courseId: number, userId: string) {
    let enrollment = await this.prismaService.enrollement.findUnique({
      where: { userId_courseId: { courseId, userId } },
    });

    if (enrollment)
      throw new BadRequestException(
        "Siz bu kursni allaqachon kursga qo'shilgansiz",
      );

    enrollment = await this.prismaService.enrollement.create({
      data: { courseId, userId },
    });
    return enrollment;
  }

  async getCourse(slug: string) {
    return await this.prismaService.course.findUnique({ where: { slug } });
  }

  async paidCourse() {}
}
