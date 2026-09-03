import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ExamInput {
  examTypeId: string;
  title: string;
  source: string;
  detectedLevel: 'B1' | 'B2' | 'B1_B2';
  examYear?: number;
  examRound?: string;
  durationMinutes?: number;
  status?: 'DRAFT' | 'ANALYZED' | 'REVIEWED' | 'PUBLISHED';
}

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.exam.findMany({
      include: { examType: true, sections: { orderBy: { position: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { examType: true, sections: { orderBy: { position: 'asc' } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  create(dto: ExamInput) {
    return this.prisma.exam.create({
      data: {
        examTypeId: dto.examTypeId,
        title: dto.title,
        source: dto.source,
        detectedLevel: dto.detectedLevel as never,
        examYear: dto.examYear,
        examRound: dto.examRound,
        durationMinutes: dto.durationMinutes,
        status: (dto.status ?? 'DRAFT') as never,
      },
    });
  }

  update(id: string, dto: Partial<ExamInput>) {
    return this.prisma.exam.update({
      where: { id },
      data: {
        title: dto.title,
        source: dto.source,
        detectedLevel: dto.detectedLevel as never | undefined,
        examYear: dto.examYear,
        examRound: dto.examRound,
        durationMinutes: dto.durationMinutes,
        status: dto.status as never | undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.exam.delete({ where: { id } });
  }
}
