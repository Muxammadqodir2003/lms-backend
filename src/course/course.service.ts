import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/courseDto';
import { UpdateDto } from './dto/updateDto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly redisService: RedisService,
  ) {}

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

  async updateCourse(
    image: Express.Multer.File,
    updateDto: UpdateDto,
    courseId: number,
    userId: string,
  ) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId, instructorId: userId },
    });

    const imageUrl = await this.supabaseService.uploadImage(image);

    if (course.image) {
      await this.supabaseService.deleteImage(course.image);
    }

    return await this.prismaService.course.update({
      where: { id: courseId },
      data: {
        ...updateDto,
        requirements: updateDto.requirements.split(','),
        whatsLearn: updateDto.whatsLearn.split(','),
        tags: updateDto.tags.split(','),
        price: +updateDto.price,
        image: imageUrl ? imageUrl : course.image,
      },
    });
  }

  async getCourse(slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
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
        isPublished: true,
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
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
        isPublished: true,
      },
    });
    return { courses, totalCourses };
  }

  async activeCourse(slug: string) {
    try {
      return await this.prismaService.course.update({
        where: { slug },
        data: { isPublished: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async deactiveCourse(slug: string) {
    try {
      return await this.prismaService.course.update({
        where: { slug },
        data: { isPublished: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(slug: string, ip: string, userAgent: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    if (!course) throw new BadRequestException('Bunday kurs topilmadi');

    const user = await this.prismaService.user.findUnique({
      where: { id: course.instructorId },
    });

    const redisUserKey = `instructor_block:${course.instructorId}`;
    const isBlock = await this.redisService.blockCourseDelete(
      redisUserKey,
      user.email,
      ip,
      userAgent,
    );
    if (!isBlock)
      throw new BadRequestException('You cannot delete 3 courses in a day.');

    if (course.isPublished) {
      await this.redisService.blockCourseDelete(
        redisUserKey,
        user.email,
        ip,
        userAgent,
      );
    }

    if (course.image) {
      await this.supabaseService.deleteImage(course.image);
    }
    return await this.prismaService.course.delete({ where: { slug } });
  }
}
