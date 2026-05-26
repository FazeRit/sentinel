import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../ports/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../ports/file-write.port';
import { PdfAnalyzerService } from '../../infra/services/pdf-analyzer.service';

@Injectable()
export class ProcessFileUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    private readonly pdfAnalyzer: PdfAnalyzerService,
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
        throw new Error('File has no storage path');
      }

      const metadata = await this.pdfAnalyzer.analyze(file.storagePath);
      file.setMetadata(metadata);
      file.markAsReady();
    } catch {
      file.markAsFailed();
    }

    await this.fileWriteRepo.saveFile(file);
  }
}
