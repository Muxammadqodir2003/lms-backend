import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/courseDto';
import { UpdateDto } from './dto/updateDto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RedisService } from 'src/redis/redis.service';
import { Prisma } from '@prisma/client';

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
    try {
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

      const coursesCount = await this.prismaService.course.count({
        where: { instructorId },
      });

      await this.prismaService.instructorProfile.update({
        where: { userId: instructorId },
        data: { coursesCount },
      });

      return course;
    } catch (error) {
      throw error;
    }
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
    return await this.prismaService.course.findUnique({
      where: { slug },
    });
  }

  async getAllCourses(query: any) {
    const { category, level, language, rating, page = 1 } = query;

    const whereCondition: Prisma.CourseWhereInput = {
      isPublished: true,
      category: category ? category : undefined,
      level: level ? level : undefined,
      language: language ? language : undefined,
      rating: rating ? { gte: Number(rating) } : undefined,
    };

    const [total, courses] = await this.prismaService.$transaction([
      this.prismaService.course.count({ where: whereCondition }),
      this.prismaService.course.findMany({
        where: whereCondition,
        skip: (page - 1) * 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { courses, totalCourses: total };
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
    const deletedCourse = await this.prismaService.course.delete({
      where: { slug },
    });

    const coursesCount = await this.prismaService.course.count({
      where: { instructorId: course.instructorId },
    });
    await this.prismaService.instructorProfile.update({
      where: { userId: course.instructorId },
      data: { coursesCount },
    });
    return deletedCourse;
  }
}
