import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      include: { sections: { include: { lessons: { select: { id: true } } } } },
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
      where: { userId, status: 'PAID' },
      include: { course: true },
    });
  }

  async getUnpaidCourses(userId: string) {
    return await this.prismaService.enrollement.findMany({
      where: { userId, status: 'PENDING' },
      include: {
        course: {
          include: {
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async deleteEnrollment(courseId: number, userId: string) {
    try {
      const enrollment = await this.prismaService.enrollement.findUnique({
        where: { userId_courseId: { courseId, userId } },
      });
      if (!enrollment) throw new NotFoundException('Enrollment not found');
      return await this.prismaService.enrollement.delete({
        where: { userId_courseId: { courseId, userId } },
      });
    } catch (error) {
      throw error;
    }
  }

  async payCourses(userId: string) {
    try {
      await this.prismaService.enrollement.updateMany({
        where: { userId },
        data: { status: 'PAID' },
      });

      const enrollments = await this.prismaService.enrollement.findMany({
        where: { userId },
      });

      const allCourses = await this.prismaService.course.findMany({
        where: { id: { in: enrollments.map((e) => e.courseId) } },
      });

      for (const course of allCourses) {
        await this.prismaService.instructorProfile.update({
          where: { userId: course.instructorId },
          data: { studentsCount: { increment: 1 } },
        });
        await this.prismaService.course.update({
          where: { id: course.id },
          data: { studentsCount: { increment: 1 } },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async completeLesson(lessonId: number, userId: string, slug: string) {
    try {
      // 1. LessonProgress yaratishga urinib ko‘ramiz
      await this.prismaService.lessonProgress.create({
        data: { userId, lessonId },
      });
    } catch (error) {
      // 2. Agar unique constraint buzilsa — demak tugatib bo‘lgan
      if (error.code === 'P2002') {
        throw new BadRequestException('Siz bu darsni allaqachon tugatgansiz!');
      }
      throw error;
    }

    // 3. Course ni olish
    const course = await this.prismaService.course.findUnique({
      where: { slug },
      include: { sections: { include: { lessons: true } } },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    // 4. Enrollement tekshiruvi
    const enrollement = await this.prismaService.enrollement.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });

    if (!enrollement) {
      throw new BadRequestException('Siz bu kursga yozilmagansiz');
    }

    // 5. Barcha darslar
    const allLessons = course.sections
      .flatMap((section) => section.lessons)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const progresses = await this.prismaService.lessonProgress.findMany({
      where: { userId },
    });

    const completedLessonIds = progresses.map((p) => p.lessonId);

    const currentLesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!currentLesson) {
      throw new NotFoundException('Dars topilmadi');
    }

    // 6. Keyingi dars
    const nextLesson =
      allLessons.find(
        (l) =>
          l.sectionId === currentLesson.sectionId &&
          !completedLessonIds.includes(l.id),
      ) || allLessons.find((l) => !completedLessonIds.includes(l.id));

    // 7. Progressni aniq hisoblash
    const progress = Math.min(
      Math.round((completedLessonIds.length / allLessons.length) * 100),
      100,
    );

    await this.prismaService.enrollement.update({
      where: { userId_courseId: { userId, courseId: course.id } },
      data: {
        currentLessonId: nextLesson?.id ?? null,
        progress,
      },
    });

    return {
      nextLessonId: nextLesson?.id ?? null,
      finished: !nextLesson,
    };
  }
}
