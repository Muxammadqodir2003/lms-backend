import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService, PrismaService],
})
export class InstructorModule {}
