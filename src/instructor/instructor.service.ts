import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstructorDto } from './dto/intructorDto';

@Injectable()
export class InstructorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async becomeIntructor(instructorDto: InstructorDto, id: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      const instructorProfile =
        await this.prismaService.instructorProfile.findUnique({
          where: { userId: user.id },
        });
      if (instructorProfile) {
        throw new BadRequestException('Bu foydalanuvchi allaqachon instruktor');
      }
      await this.prismaService.instructorProfile.create({
        data: {
          userId: user.id,
          ...instructorDto,
        },
      });
      this.mailService.sendApplyInstructorRequest(
        'aralxanovmuxammadqodir4@gmail.com',
        user.email,
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCourses(id: string) {
    if (!id)
      throw new BadRequestException('Bunday foydalanuvchi id si topilmadi');
    return await this.prismaService.course.findMany({
      where: { instructorId: id },
    });
  }

  async getCourseDetail(slug: string) {
    return await this.prismaService.course.findUnique({ where: { slug } });
  }

  async getAllInstructor(limit?: number) {
    return await this.prismaService.user.findMany({
      where: { role: 'INSTRUCTOR' },
      take: limit,
      select: { id: true, email: true, instructorProfile: true },
    });
  }
}
