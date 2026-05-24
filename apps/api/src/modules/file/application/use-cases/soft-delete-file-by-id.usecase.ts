import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../ports/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../ports/file-write.port';

@Injectable()
export class SoftDeleteFileByIdUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
  ) {}

  async execute(id: string): Promise<void> {
    const file = await this.fileReadRepo.findFileById(id);
    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    file.softDelete();

    await this.fileWriteRepo.saveFile(file);
  }
}
