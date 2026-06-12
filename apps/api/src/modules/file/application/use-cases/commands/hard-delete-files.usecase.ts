import { Inject, Injectable } from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../../ports/database/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../../ports/database/file-write.port';
import {
  MEMORY_STORAGE_WRITE_PORT,
  MemoryStorageWritePort,
} from '../../ports/storage/memory-storage-write.port';
import {
  FILE_VECTOR_STORAGE_WRITE_PORT,
  FileVectorStorageWritePort,
} from '../../ports/vector/file-vector-storage-write.port';

@Injectable()
export class HardDeleteFilesUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
    @Inject(MEMORY_STORAGE_WRITE_PORT)
    private readonly storageWrite: MemoryStorageWritePort,
    @Inject(FILE_VECTOR_STORAGE_WRITE_PORT)
    private readonly vectorStorage: FileVectorStorageWritePort,
  ) {}

  async execute(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
      return;
    }

    const files = await this.fileReadRepo.findFilesByIds(ids);

    await this.vectorStorage.deleteFiles(ids);

    if (files.length === 0) {
      await this.fileWriteRepo.hardDeleteFiles(ids);
      return;
    }

    await Promise.allSettled(
      files.map(async (file) => {
        if (file.storagePath) {
          await this.storageWrite.delete(file.storagePath);
        }
      }),
    );

    await this.fileWriteRepo.hardDeleteFiles(ids);
  }
}
