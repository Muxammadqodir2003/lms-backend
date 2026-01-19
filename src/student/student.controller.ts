import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @HttpCode(201)
  @Post('enrollment/:courseId')
  @Auth('STUDENT')
  async enrollCourse(
    @Param('courseId') courseId: string,
    @User('id') userId: string,
  ) {
    return this.studentService.enrollCourse(+courseId, userId);
  }

  @HttpCode(200)
  @Get('course/:slug')
  async getCourse(@Param('slug') slug: string) {
    return this.studentService.getCourse(slug);
  }

  @HttpCode(200)
  @Get('enrolled-courses')
  @Auth('STUDENT')
  async getEnrolledCourses(@User('id') userId: string) {
    return this.studentService.getEnrolledCourses(userId);
  }

  @HttpCode(200)
  @Post('complete-lesson/:lessonId')
  @Auth('STUDENT')
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @Query('slug') slug: string,
    @User('id') userId: string,
  ) {
    return this.studentService.completeLesson(+lessonId, userId, slug);
  }
}
