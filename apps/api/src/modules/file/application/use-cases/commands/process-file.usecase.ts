import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../../ports/database/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../../ports/database/file-write.port';
import {
  FILE_VECTOR_STORAGE_WRITE_PORT,
  FileVectorStorageWritePort,
} from '../../ports/vector/file-vector-storage-write.port';
import {
  FILE_ANALYZER_PORT,
  FileAnalyzerPort,
} from '../../ports/analysis/file-analyzer.port';

@Injectable()
export class ProcessFileUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(FILE_ANALYZER_PORT)
    private readonly fileAnalyzer: FileAnalyzerPort,
    @Inject(FILE_VECTOR_STORAGE_WRITE_PORT)
    private readonly vectorStorage: FileVectorStorageWritePort,
  ) {}

  async execute(fileId: string): Promise<void> {
    const file = await this.fileReadRepo.findFileById(fileId);
    if (!file) {
      throw new NotFoundException(`File with ID "${fileId}" not found`);
    }

    file.markAsProcessing();
    await this.fileWriteRepo.saveFile(file);

    try {
      if (!file.storagePath) {
        throw new BadRequestException('File has no storage path');
      }

      const metadata = await this.fileAnalyzer.analyze(file.storagePath);
      file.setMetadata(metadata);

      // TODO: change to normal vector
      await this.vectorStorage.saveFile({
        id: file.id,
        vector: new Array(1536).fill(0),
        payload: {
          file_id: file.id,
          lab_id: file.labId || '',
          user_id: file.ownerId,
          pageCount: file.pageCount ?? undefined,
          title: file.title ?? undefined,
          author: file.author ?? undefined,
        },
      });

      file.markAsReady();
    } catch {
      file.markAsFailed();
    }

    await this.fileWriteRepo.saveFile(file);
  }
}
