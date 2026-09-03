import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface BlueprintItemInput {
  sectionCode: string;
  questionTypeId?: string;
  topicId?: string;
  questionCount?: number;
  weight?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  level?: 'B1' | 'B2' | 'B1_B2';
}

interface BlueprintInput {
  examTypeId: string;
  name: string;
  version: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  sourceExamCount?: number;
  items?: BlueprintItemInput[];
}

@Injectable()
export class ExamPatternsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.examBlueprint.findMany({
      include: { examType: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const bp = await this.prisma.examBlueprint.findUnique({
      where: { id },
      include: {
        items: { include: { topic: true, questionType: true } },
        examType: true,
      },
    });
    if (!bp) throw new NotFoundException('Blueprint not found');
    return bp;
  }

  create(dto: BlueprintInput) {
    return this.prisma.examBlueprint.create({
      data: {
        examTypeId: dto.examTypeId,
        name: dto.name,
        version: dto.version,
        status: (dto.status ?? 'DRAFT') as never,
        sourceExamCount: dto.sourceExamCount ?? 0,
        items: dto.items
          ? {
              create: dto.items.map((it) => ({
                sectionCode: it.sectionCode,
                questionTypeId: it.questionTypeId,
                topicId: it.topicId,
                questionCount: it.questionCount,
                weight: it.weight,
                difficulty: it.difficulty as never | undefined,
                level: it.level as never | undefined,
              })),
            }
          : undefined,
      },
      include: { items: true },
    });
  }

  async update(id: string, dto: Partial<BlueprintInput>) {
    return this.prisma.$transaction(async (tx) => {
      const bp = await tx.examBlueprint.update({
        where: { id },
        data: {
          name: dto.name,
          version: dto.version,
          status: dto.status as never | undefined,
          sourceExamCount: dto.sourceExamCount,
        },
      });
      if (dto.items) {
        await tx.examBlueprintItem.deleteMany({ where: { blueprintId: id } });
        for (const it of dto.items) {
          await tx.examBlueprintItem.create({
            data: {
              blueprintId: id,
              sectionCode: it.sectionCode,
              questionTypeId: it.questionTypeId,
              topicId: it.topicId,
              questionCount: it.questionCount,
              weight: it.weight,
              difficulty: it.difficulty as never | undefined,
              level: it.level as never | undefined,
            },
          });
        }
      }
      return bp;
    });
  }

  remove(id: string) {
    return this.prisma.examBlueprint.delete({ where: { id } });
  }
}
