import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto/commentDto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(data: CommentDto, userId: string, slug: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    await this.prisma.comment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      create: {
        ...data,
        userId,
        courseId: course.id,
      },
      update: {
        ...data,
        userId,
        courseId: course.id,
      },
    });

    const allComment = [];
    const allCourse = await this.prisma.course.findMany({
      where: {
        instructorId: course.instructorId,
      },
      select: {
        rating: true,
      },
    });

    allComment.push(...allCourse);

    const totalCourseRating = allComment.reduce(
      (acc, comment) => acc + comment.rating,
      0,
    );
    const averageCourseRating = totalCourseRating / allComment.length || 0;

    await this.prisma.instructorProfile.update({
      where: {
        userId: course.instructorId,
      },
      data: {
        rating: averageCourseRating,
      },
    });

    const comments = await this.prisma.comment.findMany({
      where: {
        courseId: course.id,
      },
    });

    const totalRating = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0,
    );
    const averageRating = totalRating / comments.length || 0;

    await this.prisma.course.update({
      where: {
        id: course.id,
      },
      data: {
        rating: averageRating,
      },
    });

    const commentsCount = await this.prisma.comment.count({
      where: {
        courseId: course.id,
      },
    });

    await this.prisma.course.update({
      where: {
        id: course.id,
      },
      data: {
        commentsCount,
      },
    });
  }

  async getCommentsByCourseId(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return await this.prisma.comment.findMany({
      where: {
        courseId: course.id,
      },
      include: {
        user: true,
      },
    });
  }

  async getCommentOne(userId: string, slug: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return await this.prisma.comment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });
  }
}
