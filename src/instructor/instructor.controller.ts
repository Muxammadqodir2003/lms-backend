import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InstructorDto } from './dto/intructorDto';
import { InstructorService } from './instructor.service';
import { User } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @HttpCode(200)
  @Post('become-instructor')
  @Auth('STUDENT')
  async becomeInstructor(
    @Body() instructorDto: InstructorDto,
    @User('id') id: string,
  ) {
    return await this.instructorService.becomeIntructor(instructorDto, id);
  }

  @HttpCode(200)
  @Get('get-all')
  @Auth('INSTRUCTOR')
  async getAllCourses(@User('id') id: string) {
    return this.instructorService.getAllCourses(id);
  }

  @HttpCode(200)
  @Get('course/:slug')
  @Auth('INSTRUCTOR')
  async getCourseDetail(@Param('slug') slug: string) {
    return this.instructorService.getCourseDetail(slug);
  }

  @HttpCode(200)
  @Get('all')
  async getAllInstructor(@Query('limit') limit: number) {
    return this.instructorService.getAllInstructor(limit);
  }
}
