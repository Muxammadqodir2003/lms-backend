import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionDto } from './dto/section.dto';

@Injectable()
export class SectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(sectionDto: SectionDto, courseId: number) {
    return await this.prismaService.section.create({
      data: { ...sectionDto, courseId },
    });
  }

  async getAll(courseId: number) {
    return await this.prismaService.section.findMany({ where: { courseId } });
  }

  async delete(id: number) {
    return await this.prismaService.section.delete({ where: { id } });
  }

  async update(id: number, name: string) {
    return await this.prismaService.section.update({
      where: { id },
      data: { name },
    });
  }
}
