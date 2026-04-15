import { Inject } from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { FILE_READ_PORT } from '../ports/file-read.port';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';

export class FindFilesByLabIdUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
  ) {}

  async execute(labId: string): Promise<Array<FileEntity>> {
    const files = await this.fileReadRepo.findByLabId(labId);

    return files ?? [];
  }
}
