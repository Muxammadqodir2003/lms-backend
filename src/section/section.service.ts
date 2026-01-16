import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionDto } from './dto/section.dto';

@Injectable()
export class SectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(sectionDto: SectionDto, slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
      include: { sections: true },
    });

    return await this.prismaService.section.create({
      data: {
        name: sectionDto.name,
        courseId: course.id,
        orderIndex: course.sections.length + 1,
      },
    });
  }

  async getAll(slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
      include: { sections: true },
    });
    return await this.prismaService.section.findMany({
      where: { courseId: course.id },
      include: { lessons: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getByCourseSlug(slug: string) {
    const course = await this.prismaService.course.findUnique({
      where: { slug },
    });
    return await this.prismaService.section.findMany({
      where: { courseId: course.id },
      include: { lessons: true },
      orderBy: { orderIndex: 'asc' },
    });
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

  async reorder(sections: { id: number; orderIndex: number }[]) {
    return this.prismaService.$transaction(
      sections.map((secton) =>
        this.prismaService.section.update({
          where: { id: secton.id },
          data: { orderIndex: secton.orderIndex },
        }),
      ),
    );
  }
}
