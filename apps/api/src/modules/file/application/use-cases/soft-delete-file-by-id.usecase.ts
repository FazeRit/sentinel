import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';
import { FileWriteRepository } from '../../infra/repositories/file-write.repository';
import { FILE_READ_PORT } from '../ports/file-read.port';
import { FILE_WRITE_PORT } from '../ports/file-write.port';

@Injectable()
export class SoftDeleteFileByIdUseCase {
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWriteRepository,
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
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
