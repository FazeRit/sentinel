import { Inject, Injectable } from '@nestjs/common';
import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileReadRepository } from '../../infra/repositories/file-read.repository';
import { FILE_READ_PORT } from '../ports/file-read.port';

@Injectable()
export class FindFilesUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadRepository,
  ) {}

  async execute(
    labId?: string,
    ownerId?: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginationResult<FileEntity>> {
    const { items, meta } = await this.fileReadRepo.findFiles(
      limit,
      labId,
      ownerId,
      cursor,
    );

    return {
      items,
      meta,
    };
  }
}
