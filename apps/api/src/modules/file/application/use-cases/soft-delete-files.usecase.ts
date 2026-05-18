import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';
import { FileWriteRepository } from '../../infra/repositories/file-write.repository';
import { LocalStorageWriteService } from '../../infra/services/local-storage-write.service';
import { FILE_READ_PORT } from '../ports/file-read.port';
import { FILE_WRITE_PORT } from '../ports/file-write.port';
import { MEMORY_STORAGE_WRITE_PORT } from '../ports/memory-storage-write.port';

@Injectable()
export class SoftDeleteFilesUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWriteRepository,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
    @Inject(MEMORY_STORAGE_WRITE_PORT)
    private readonly storageWrite: LocalStorageWriteService,
  ) {}

  async execute(labId: string, ownerId?: string): Promise<void> {
    const { items: files } = await this.fileReadRepo.findFiles(
      undefined,
      labId,
      ownerId,
    );

    if (!files || files.length === 0) {
      throw new NotFoundException(
        `No files found for laboratory with ID "${labId}"`,
      );
    }

    await this.fileWriteRepo.softDeleteFiles(labId, ownerId);
  }
}
