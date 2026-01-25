import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CourseDto } from './dto/courseDto';
import { User } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateDto } from './dto/updateDto';
import { SupabaseService } from 'src/supabase/supabase.service';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { RATE_LIMIT } from 'src/constants';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @HttpCode(201)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1024 * 1024 * 2 },
      fileFilter(req, file, callback) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/i)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @Auth('INSTRUCTOR')
  async createCourse(
    @Body() courseDto: CourseDto,
    @User('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = await this.supabaseService.uploadImage(image);
    return await this.courseService.createCourse(courseDto, imageUrl, id);
  }

  @HttpCode(200)
  @Patch('update/:courseId')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter(req, file, callback) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/i)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @Auth('INSTRUCTOR')
  async updateCourse(
    @Body() updateDto: UpdateDto,
    @Param('courseId') courseId: string,
    @User('id') userId: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.courseService.updateCourse(
      image,
      updateDto,
      +courseId,
      userId,
    );
  }

  @HttpCode(200)
  @Get('get-course-by-slug/:slug')
  @Auth('STUDENT')
  async getCourse(@Param('slug') slug: string) {
    return await this.courseService.getCourse(slug);
  }

  @HttpCode(200)
  @Get('get-all-courses')
  @Auth('STUDENT')
  async getAllCourses(@Query() query: any) {
    console.log(query);
    return await this.courseService.getAllCourses(query);
  }

  @HttpCode(200)
  @Post('active/:slug')
  @Auth('INSTRUCTOR')
  async activeCourse(@Param('slug') slug: string) {
    return await this.courseService.activeCourse(slug);
  }

  @HttpCode(200)
  @Post('deactive/:slug')
  @Auth('INSTRUCTOR')
  async deactiveCourse(@Param('slug') slug: string) {
    return await this.courseService.deactiveCourse(slug);
  }

  @Throttle({
    default: {
      limit: RATE_LIMIT.DELETE_COURSE.limit,
      ttl: RATE_LIMIT.DELETE_COURSE.ttl,
    },
  })
  @HttpCode(200)
  @Delete('delete/:slug')
  @Auth('INSTRUCTOR')
  async deleteCourse(@Param('slug') slug: string, @Req() req: Request) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];
    return await this.courseService.delete(slug, ip, userAgent);
  }
}
