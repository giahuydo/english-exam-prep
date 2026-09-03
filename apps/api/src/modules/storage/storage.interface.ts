export interface UploadedObject {
  bucket: string | null;
  path: string | null;
  checksum: string | null;
}

/**
 * Storage backend contract. Real impl (Google Cloud Storage) plugs in later.
 */
export interface StorageService {
  upload(
    file: { originalname: string; buffer: Buffer; mimetype: string; size: number },
  ): Promise<UploadedObject>;

  delete(bucket: string, path: string): Promise<void>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
