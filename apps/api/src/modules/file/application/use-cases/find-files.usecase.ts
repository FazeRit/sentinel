import { Inject, Injectable } from '@nestjs/common';
import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { FileEntity } from '../../domain/entities/file.entity';
import { FILE_READ_PORT, FileReadPort } from '../ports/file-read.port';

@Injectable()
export class FindFilesUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
  ) {}

  async execute(
    labId?: string,
    ownerId?: string,
    cursor?: string,
    limit: number = 10,
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
