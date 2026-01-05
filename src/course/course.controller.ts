import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CourseDto } from './dto/courseDto';
import { User } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateDto } from './dto/updateDto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @HttpCode(201)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/uploads/images',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @Auth('INSTRUCTOR')
  async createCourse(
    @Body() courseDto: CourseDto,
    @User('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = `public/uploads/images/${image.filename}`;
    console.log(courseDto, imageUrl, id);
    return this.courseService.createCourse(courseDto, imageUrl, id);
  }

  @HttpCode(200)
  @Patch('update/:courseId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/uploads/images',
        filename(req, file, callback) {
          if (!file) return callback(null, '');
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @Auth('INSTRUCTOR')
  async updateCourse(
    @Body() updateDto: UpdateDto,
    @Param('courseId') courseId: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = `public/uploads/images/${image?.filename}`;
    console.log(updateDto);
    return this.courseService.updateCourse(updateDto, imageUrl, +courseId);
  }

  @HttpCode(200)
  @Get('course/:slug')
  @Auth('STUDENT')
  async getCourse(@Param('slug') slug: string) {
    return this.courseService.getCourse(slug);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  @Auth('INSTRUCTOR')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.delete(+id);
  }
}
