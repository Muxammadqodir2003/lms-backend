import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, MailService],
})
export class AdminModule {}
