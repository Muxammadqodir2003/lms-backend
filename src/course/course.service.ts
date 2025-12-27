import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/courseDto';
import { UpdateDto } from './dto/updateDto';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCourse(
    courseDto: CourseDto,
    image: string,
    instructorId: string,
  ) {
    const instructor = await this.prismaService.instructorProfile.findUnique({
      where: { userId: instructorId },
    });
    if (!instructor.isActive)
      throw new BadRequestException(
        'Siz hozirda kurs joylay olmaysiz sizning hisobingiz faollashtirilmagan iltimos admin sizni hisobingizni faollashtirirshini kuting',
      );
    let course = await this.prismaService.course.findUnique({
      where: { slug: courseDto.slug },
    });
    if (course) throw new BadRequestException("Slug noyob bo'lishi kerak");

    course = await this.prismaService.course.create({
      data: { ...courseDto, image, instructorId },
    });

    return course;
  }

  async updateCourse(
    updateDto: UpdateDto,
    image: string,
    courseId: number,
    instructorId: string,
  ) {
    const instructorProfile =
      await this.prismaService.instructorProfile.findUnique({
        where: { userId: instructorId },
      });
    if (!instructorProfile.isActive)
      throw new BadRequestException(
        "Siz hisobingiz faol bo'lmagan holatda kurslarni tahrirlay olmaysiz",
      );

    return await this.prismaService.course.update({
      where: { id: courseId },
      data: { ...updateDto, image },
    });
  }

  async getCourse(slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    const count = await this.prismaService.enrollement.count({
      where: { courseId: course.id },
    });
    return { ...course, count };
  }

  async delete(id: number) {
    return await this.prismaService.course.delete({ where: { id } });
  }
}
