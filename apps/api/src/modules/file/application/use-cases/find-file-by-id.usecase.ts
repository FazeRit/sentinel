import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILE_READ_PORT } from '../ports/file-read.port';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';
import { FileEntity } from '../../domain/entities/file.entity';

@Injectable()
export class FindFileByIdUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
  ) {}

  async execute(id: string): Promise<FileEntity> {
    const fileEntity = await this.fileReadRepo.findFileById(id);

    if (!fileEntity) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    return fileEntity;
  }
}
