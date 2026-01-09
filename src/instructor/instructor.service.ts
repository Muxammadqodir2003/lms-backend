import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstructorDto } from './dto/intructorDto';
import { InstructorGateway } from './gateway/instructor.gateway';

@Injectable()
export class InstructorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly instructorGateway: InstructorGateway,
  ) {}

  async becomeIntructor(instructorDto: InstructorDto, id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    let instructorProfile =
      await this.prismaService.instructorProfile.findUnique({
        where: { userId: user.id },
      });
    if (instructorProfile) {
      throw new BadRequestException(
        "Siz allaqachon instruktor so'rov yubordingiz admin sizni qabul qilishni kutib turing",
      );
    }
    instructorProfile = await this.prismaService.instructorProfile.create({
      data: {
        userId: user.id,
        ...instructorDto,
      },
    });

    const admins = await this.prismaService.user.findMany({
      where: { role: 'ADMIN' },
    });

    admins.forEach((admin) => {
      this.mailService.sendApplyInstructorRequest(admin.email, user.email);
      this.instructorGateway.sendToAdmin({ ...user, instructorProfile });
    });
    return true;
  }

  async getAllCourses(id: string) {
    if (!id)
      throw new BadRequestException('Bunday foydalanuvchi id si topilmadi');
    return await this.prismaService.course.findMany({
      where: { instructorId: id },
    });
  }

  async getCourseDetail(slug: string) {
    return await this.prismaService.course.findUnique({
      where: { slug },
      include: { sections: { include: { lessons: true } } },
    });
  }

  async getAllInstructor(page?: number, limit?: number) {
    const instructorsProfiles =
      await this.prismaService.instructorProfile.findMany({});
    const ids = instructorsProfiles.map((profile) => profile.userId);
    return await this.prismaService.user.findMany({
      where: { id: { in: ids } },
      take: limit,
      skip: (page - 1) * limit,
      select: { id: true, email: true, instructorProfile: true },
    });
  }
}
