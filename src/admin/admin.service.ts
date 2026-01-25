import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
  ) {}

  async approveInstructor(id: string, adminEmail: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('Bunday user topilmadi');
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { role: 'INSTRUCTOR' },
    });
    await this.prismaService.instructorProfile.update({
      where: { userId: id },
      data: { isActive: true },
    });
    await this.mailService.sendApproveEmail(
      user.email,
      adminEmail,
      'http://localhost:3000',
    );
    return true;
  }

  async deactivateInstructor(id: string) {
    if (!id) throw new BadRequestException('Bu id bilan instruktor topilmadi');
    await this.prismaService.instructorProfile.update({
      where: { userId: id },
      data: { isActive: false },
    });
    return true;
  }

  async getLogs(page: number) {
    return await this.prismaService.log.findMany({
      skip: (page - 1) * 8,
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }
}
