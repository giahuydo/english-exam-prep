import { Global, Module } from '@nestjs/common';
import { NoopStorageService } from './noop-storage.service';
import { STORAGE_SERVICE } from './storage.interface';

@Global()
@Module({
  providers: [
    NoopStorageService,
    { provide: STORAGE_SERVICE, useExisting: NoopStorageService },
  ],
  exports: [STORAGE_SERVICE, NoopStorageService],
})
export class StorageModule {}
