import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface QuestionTypeInput {
  code: string;
  name: string;
  category: string;
}

@Injectable()
export class QuestionTypesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.questionType.findMany({ orderBy: { category: 'asc' } });
  }

  create(dto: QuestionTypeInput) {
    return this.prisma.questionType.create({ data: dto });
  }

  async update(id: string, dto: Partial<QuestionTypeInput>) {
    const existing = await this.prisma.questionType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('QuestionType not found');
    return this.prisma.questionType.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.questionType.delete({ where: { id } });
  }
}
