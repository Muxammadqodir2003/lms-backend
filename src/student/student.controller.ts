import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll course' })
  @Post('enrollment/:courseId')
  @Auth('STUDENT')
  async enrollCourse(
    @Param('courseId') courseId: string,
    @User('id') userId: string,
  ) {
    return this.studentService.enrollCourse(+courseId, userId);
  }

  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete enrollment' })
  @Delete('enrollment/:courseId')
  @Auth('STUDENT')
  async deleteEnrollment(
    @Param('courseId') courseId: string,
    @User('id') userId: string,
  ) {
    return this.studentService.deleteEnrollment(+courseId, userId);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course' })
  @Get('course/:slug')
  async getCourse(@Param('slug') slug: string) {
    return this.studentService.getCourse(slug);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrolled courses' })
  @Get('paid-courses')
  @Auth('STUDENT')
  async getEnrolledCourses(@User('id') userId: string) {
    return this.studentService.getEnrolledCourses(userId);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unpaid courses' })
  @Get('unpaid-courses')
  @Auth('STUDENT')
  async getUnpaidCourses(@User('id') userId: string) {
    return this.studentService.getUnpaidCourses(userId);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pay courses' })
  @Post('pay-courses')
  @Auth('STUDENT')
  async payCourses(@User('id') userId: string) {
    return this.studentService.payCourses(userId);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete lesson' })
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
