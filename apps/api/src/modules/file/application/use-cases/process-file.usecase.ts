import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../ports/file-read.port';
import { FILE_WRITE_PORT, FileWritePort } from '../ports/file-write.port';
import { PDF_ANALYZER_PORT, PdfAnalyzerPort } from '../ports/pdf-analyzer.port';

@Injectable()
export class ProcessFileUseCase {
  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(PDF_ANALYZER_PORT)
    private readonly pdfAnalyzer: PdfAnalyzerPort,
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

      const metadata = await this.pdfAnalyzer.analyze(file.storagePath);
      file.setMetadata(metadata);
      file.markAsReady();
    } catch {
      file.markAsFailed();
    }

    await this.fileWriteRepo.saveFile(file);
  }
}
