import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../../ports/database/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../../ports/database/file-write.port';

@Injectable()
export class SoftDeleteFilesUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
  ) {}

  async execute(labId: string, ownerId?: string): Promise<void> {
    const count = await this.fileReadRepo.countFiles(labId, ownerId);

    if (count === 0) {
      throw new NotFoundException(
        `No files found for laboratory with ID "${labId}"`,
      );
    }

    await this.fileWriteRepo.softDeleteFiles(labId, ownerId);
  }
}
