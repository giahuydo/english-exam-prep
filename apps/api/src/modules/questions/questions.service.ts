import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@app/database';
import {
  CreateQuestionDto,
  QuestionOrigin,
  QuestionStatus,
  UpdateQuestionDto,
} from '@app/shared';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { status?: string; questionTypeId?: string } = {}) {
    return this.prisma.question.findMany({
      where: {
        status: params.status as never,
        questionTypeId: params.questionTypeId,
      },
      include: {
        questionType: true,
        topics: { include: { topic: true } },
        options: { orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findById(id: string) {
    const q = await this.prisma.question.findUnique({
      where: { id },
      include: {
        questionType: true,
        topics: { include: { topic: true } },
        options: { orderBy: { position: 'asc' } },
      },
    });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async create(dto: CreateQuestionDto, createdById?: string) {
    // BUSINESS RULE: AI-generated questions always start as DRAFT and must be
    // reviewed by an admin before publishing.
    const status =
      dto.origin === QuestionOrigin.AI_GENERATED
        ? QuestionStatus.DRAFT
        : (dto.status ?? QuestionStatus.DRAFT);

    const primaryTopicId = dto.primaryTopicId;
    const secondaryTopicIds = dto.secondaryTopicIds.filter((id) => id !== primaryTopicId);

    const topicLinks: Prisma.QuestionTopicCreateWithoutQuestionInput[] = [
      ...(primaryTopicId
        ? [
            {
              topic: { connect: { id: primaryTopicId } },
              isPrimary: true,
              source: dto.topicSource as never,
            },
          ]
        : []),
      ...secondaryTopicIds.map((topicId) => ({
        topic: { connect: { id: topicId } },
        isPrimary: false,
        source: dto.topicSource as never,
      })),
    ];

    return this.prisma.question.create({
      data: {
        examId: dto.examId,
        examSectionId: dto.examSectionId,
        questionTypeId: dto.questionTypeId,
        origin: dto.origin as never,
        contentRole: dto.contentRole as never,
        content: dto.content,
        instruction: dto.instruction,
        context: dto.context,
        level: dto.level as never,
        difficulty: dto.difficulty as never,
        hint1: dto.hint1,
        hint2: dto.hint2,
        hint3: dto.hint3,
        explanation: dto.explanation,
        ruleStructure: dto.ruleStructure,
        commonMistake: dto.commonMistake,
        example: dto.example,
        status: status as never,
        aiModel: dto.aiModel,
        aiGenerationMetadata: (dto.aiGenerationMetadata ?? undefined) as Prisma.InputJsonValue | undefined,
        createdById,
        options: {
          create: dto.options.map((o, idx) => ({
            optionKey: o.optionKey,
            content: o.content,
            isCorrect: o.isCorrect,
            explanation: o.explanation,
            position: o.position ?? idx,
          })),
        },
        topics: { create: topicLinks },
      },
      include: {
        options: true,
        topics: { include: { topic: true } },
      },
    });
  }

  async update(id: string, dto: UpdateQuestionDto, reviewedById?: string) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.question.update({
        where: { id },
        data: {
          content: dto.content,
          instruction: dto.instruction,
          context: dto.context,
          level: dto.level as never | undefined,
          difficulty: dto.difficulty as never | undefined,
          contentRole: dto.contentRole as never | undefined,
          hint1: dto.hint1,
          hint2: dto.hint2,
          hint3: dto.hint3,
          explanation: dto.explanation,
          ruleStructure: dto.ruleStructure,
          commonMistake: dto.commonMistake,
          example: dto.example,
          questionTypeId: dto.questionTypeId,
          status: dto.status as never | undefined,
          reviewedById,
        },
      });

      if (dto.options) {
        await tx.questionOption.deleteMany({ where: { questionId: id } });
        for (const [idx, o] of dto.options.entries()) {
          await tx.questionOption.create({
            data: {
              questionId: id,
              optionKey: o.optionKey,
              content: o.content,
              isCorrect: o.isCorrect,
              explanation: o.explanation,
              position: o.position ?? idx,
            },
          });
        }
      }

      if (dto.primaryTopicId !== undefined || dto.secondaryTopicIds !== undefined) {
        await tx.questionTopic.deleteMany({ where: { questionId: id } });
        const primary = dto.primaryTopicId;
        const secondaries = (dto.secondaryTopicIds ?? []).filter((tid) => tid !== primary);
        const links = [
          ...(primary
            ? [{ questionId: id, topicId: primary, isPrimary: true }]
            : []),
          ...secondaries.map((tid) => ({ questionId: id, topicId: tid, isPrimary: false })),
        ];
        if (links.length > 0) {
          await tx.questionTopic.createMany({ data: links });
        }
      }

      return updated;
    });
  }

  remove(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }
}
