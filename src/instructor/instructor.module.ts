import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstructorGateway } from './gateway/instructor.gateway';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService, PrismaService, InstructorGateway],
})
export class InstructorModule {}
