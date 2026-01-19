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

  async completeLesson(lessonId: number, userId: string, slug: string) {
    let lessonProgress = await this.prismaService.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (lessonProgress)
      throw new BadRequestException('Siz bu darsni allaqachon tugatgansiz!');

    lessonProgress = await this.prismaService.lessonProgress.create({
      data: { userId, lessonId },
    });

    const course = await this.prismaService.course.findUnique({
      where: { slug },
      include: { sections: { include: { lessons: true } } },
    });

    const progresses = await this.prismaService.lessonProgress.findMany({
      where: { userId },
    });

    const allLessons = course.sections.reduce(
      (acc, section) =>
        [...acc, ...section.lessons].sort(
          (a, b) => a.orderIndex - b.orderIndex,
        ),
      [],
    );

    const getNextLessonFromSection = (sectionId: number) => {
      const section = course.sections.find(
        (section) => section.id === sectionId,
      );
      const uncompletedLessons = section?.lessons.filter(
        (lesson) =>
          !progresses.some((progress) => progress.lessonId === lesson.id),
      );
      return uncompletedLessons?.[0].id;
    };

    const uncompletedLessons = [];
    allLessons.forEach((lesson) => {
      if (!progresses.some((progress) => progress.lessonId === lesson.id)) {
        uncompletedLessons.push(lesson.id);
      }
    });
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });

    const nextLesson =
      getNextLessonFromSection(lesson?.sectionId || 0) || uncompletedLessons[0];

    const enrollement = await this.prismaService.enrollement.findUnique({
      where: { userId_courseId: { courseId: course.id, userId } },
    });

    if (nextLesson) {
      await this.prismaService.enrollement.update({
        where: { userId_courseId: { courseId: course.id, userId } },
        data: {
          currentLessonId: nextLesson,
        },
      });
    }

    await this.prismaService.enrollement.update({
      where: { userId_courseId: { courseId: course.id, userId } },
      data: {
        progress: enrollement?.progress + Math.floor(100 / allLessons.length),
      },
    });

    return nextLesson ? nextLesson : 'Tabriklaymiz! Siz kursni tugatdingiz!';
  }

  async paidCourse() {}
}
