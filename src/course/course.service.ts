import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/courseDto';
import { UpdateDto } from './dto/updateDto';
import { CourseFiltersDto } from './dto/courseFilterDto';

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
      data: {
        ...courseDto,
        requirements: courseDto.requirements.split(','),
        whatsLearn: courseDto.whatsLearn.split(','),
        tags: courseDto.tags.split(','),
        price: +courseDto.price,
        image,
        instructorId,
      },
    });

    return course;
  }

  async updateCourse(updateDto: UpdateDto, image: string, courseId: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    return await this.prismaService.course.update({
      where: { id: courseId },
      data: {
        ...updateDto,
        requirements: updateDto.requirements.split(','),
        whatsLearn: updateDto.whatsLearn.split(','),
        tags: updateDto.tags.split(','),
        price: +updateDto.price,
        image: image ? image : course.image,
      },
    });
  }

  async getCourse(slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    const studentsCount = await this.prismaService.enrollement.count({
      where: { courseId: course.id },
    });
    return { ...course, studentsCount };
  }

  async getAllCourses(query: any) {
    const courses = await this.prismaService.course.findMany({
      where: {
        category: query.category ? query.category : undefined,
        level: query.level ? query.level : undefined,
        language: query.language ? query.language : undefined,
        rating: query.rating ? Number(query.rating) : undefined,
        // isPublished: false,
      },
      skip: query.page ? (query.page - 1) * 10 : undefined,
      take: 10,
    });
    const totalCourses = await this.prismaService.course.count({
      where: {
        category: query.category ? query.category : undefined,
        level: query.level ? query.level : undefined,
        language: query.language ? query.language : undefined,
        rating: query.rating ? Number(query.rating) : undefined,
        // isPublished: false,
      },
    });
    return { courses, totalCourses };
  }

  async delete(id: number) {
    return await this.prismaService.course.delete({ where: { id } });
  }
}
