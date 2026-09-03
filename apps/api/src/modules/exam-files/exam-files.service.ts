import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { STORAGE_SERVICE, StorageService } from '../storage/storage.interface';

@Injectable()
export class ExamFilesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  list() {
    return this.prisma.examFile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async upload(
    file: { originalname: string; buffer: Buffer; mimetype: string; size: number },
    uploadedById: string,
  ) {
    const { bucket, path, checksum } = await this.storage.upload(file);
    return this.prisma.examFile.create({
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        gcsBucket: bucket,
        gcsPath: path,
        checksum,
        status: 'UPLOADED',
        uploadedById,
      },
    });
  }
}
