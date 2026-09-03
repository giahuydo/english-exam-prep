import { Injectable, Logger } from '@nestjs/common';
import type { StorageService, UploadedObject } from './storage.interface';

/**
 * Placeholder storage. Does NOT persist bytes anywhere. Returns null
 * bucket/path so the DB stores metadata only. Swap for a real GCS impl later.
 */
@Injectable()
export class NoopStorageService implements StorageService {
  private readonly log = new Logger(NoopStorageService.name);

  async upload(file: { originalname: string; size: number }): Promise<UploadedObject> {
    this.log.warn(
      `NoopStorageService.upload called for "${file.originalname}" (${file.size} bytes) — no bytes persisted.`,
    );
    return { bucket: null, path: null, checksum: null };
  }

  async delete(bucket: string, path: string): Promise<void> {
    this.log.warn(`NoopStorageService.delete called for ${bucket}/${path} — no-op.`);
  }
}
