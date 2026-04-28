import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';
import { FileWriteRepository } from '../../infra/repositories/file-write.repository';
import { LocalStorageWriteService } from '../../infra/services/local-storage-write.service';
import { FILE_READ_PORT } from '../ports/file-read.port';
import { FILE_WRITE_PORT } from '../ports/file-write.port';
import { MEMORY_STORAGE_WRITE_PORT } from '../ports/memory-storage-write.port';

@Injectable()
export class DeleteFileByIdUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWriteRepository,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
    @Inject(MEMORY_STORAGE_WRITE_PORT)
    private readonly storageWrite: LocalStorageWriteService,
  ) {}

  async execute(id: string): Promise<void> {
    const file = await this.fileReadRepo.findFileById(id);

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    const { storagePath } = file;

    if (storagePath) {
      await this.storageWrite.delete(storagePath);
    }

    await this.fileWriteRepo.deleteFileById(id);
  }
}
