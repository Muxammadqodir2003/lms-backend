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
import { Throttle } from '@nestjs/throttler';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Throttle({
    default: {
      limit: 5,
      ttl: 60 * 60 * 24,
    },
  })
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
    return await this.instructorService.getAllCourses(id);
  }

  @HttpCode(200)
  @Get('course/:slug')
  @Auth('INSTRUCTOR')
  async getCourseDetail(@Param('slug') slug: string) {
    return await this.instructorService.getCourseDetail(slug);
  }

  @HttpCode(200)
  @Get('all')
  async getAllInstructor(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return await this.instructorService.getAllInstructor(+page, +limit);
  }

  @HttpCode(200)
  @Get('get-by-id/:id')
  async getInstructorById(@Param('id') id: string) {
    return await this.instructorService.getInstructorById(id);
  }
}
