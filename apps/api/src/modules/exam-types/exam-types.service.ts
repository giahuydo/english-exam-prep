import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ExamTypeInput {
  code: string;
  name: string;
  description?: string;
  levelFrom?: 'B1' | 'B2' | 'B1_B2';
  levelTo?: 'B1' | 'B2' | 'B1_B2';
}

@Injectable()
export class ExamTypesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.examType.findMany({ orderBy: { code: 'asc' } });
  }

  create(dto: ExamTypeInput) {
    return this.prisma.examType.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        levelFrom: dto.levelFrom as never | undefined,
        levelTo: dto.levelTo as never | undefined,
      },
    });
  }

  update(id: string, dto: Partial<ExamTypeInput>) {
    return this.prisma.examType.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        levelFrom: dto.levelFrom as never | undefined,
        levelTo: dto.levelTo as never | undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.examType.delete({ where: { id } });
  }
}
