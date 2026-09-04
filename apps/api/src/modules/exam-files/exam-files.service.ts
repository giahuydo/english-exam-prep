import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { STORAGE_SERVICE, StorageService } from '../storage/storage.interface';
import { importDataset } from '../../../../../packages/database/prisma/seed/import-dataset';
import { datasetValidationFlags, validateDataset, type ExamDataset } from '../../../../../packages/database/prisma/seed/types';
import type { PrismaClient } from '@app/database';

@Injectable()
export class ExamFilesService {
  constructor(private readonly prisma: PrismaService, @Inject(STORAGE_SERVICE) private readonly storage: StorageService) {}
  list() { return this.prisma.examFile.findMany({ include: { exams: { include: { examType: true, sections: { orderBy: { position: 'asc' } } } } }, orderBy: { createdAt: 'desc' }, take: 100 }); }
  async upload(file: { originalname: string; buffer: Buffer; mimetype: string; size: number }, uploadedById: string) { const { bucket, path, checksum } = await this.storage.upload(file); return this.prisma.examFile.create({ data: { originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size, gcsBucket: bucket, gcsPath: path, checksum, status: 'UPLOADED', uploadedById } }); }
  async saveDraft(id: string, dataset: ExamDataset) { const errors = validateDataset(dataset); const flags = datasetValidationFlags(dataset); await this.prisma.examFile.update({ where: { id }, data: { extractedText: JSON.stringify(dataset), status: errors.length ? 'FAILED' : 'READY', processingError: errors.length ? errors.join('\n') : null } }); return { valid: errors.length === 0, errors, flags }; }
  async getReview(id: string) { const file = await this.prisma.examFile.findUnique({ where: { id } }); if (!file) throw new NotFoundException('Exam file not found'); let draft: ExamDataset | null = null; try { draft = file.extractedText ? JSON.parse(file.extractedText) as ExamDataset : null; } catch { throw new BadRequestException('Stored draft is not valid JSON'); } const errors = draft ? validateDataset(draft) : ['No extracted dataset draft']; const flags = draft ? datasetValidationFlags(draft) : []; return { file, draft, valid: errors.length === 0, errors, flags }; }
  async validate(id: string) { const review = await this.getReview(id); return { fileId: id, valid: review.valid, errors: review.errors, flags: review.flags, summary: review.draft ? { sections: review.draft.sections.length, questions: review.draft.questions.length, groups: review.draft.groups?.length ?? 0 } : null }; }
  async approveAndSeed(id: string) { const review = await this.getReview(id); if (!review.draft || !review.valid) throw new BadRequestException({ message: 'Draft must pass validation before seeding', errors: review.errors }); const result = await importDataset(this.prisma as unknown as PrismaClient, review.draft); await this.prisma.examFile.update({ where: { id }, data: { status: 'READY', processingError: null } }); return { seeded: true, ...result }; }
}
