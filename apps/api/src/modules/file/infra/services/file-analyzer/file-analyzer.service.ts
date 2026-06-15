import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { FileAnalyzerPort } from '../../../application/ports/analysis/file-analyzer.port';
import { FileMetadata } from '../../../domain/types/file.types';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class FileAnalyzerService implements FileAnalyzerPort {
  async analyze(storagePath: string): Promise<FileMetadata> {
    const buffer = await readFile(storagePath);

    const parser = new PDFParse({
      data: buffer,
    });
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();

    return {
      pageCount: textResult.total,
      title: infoResult.info?.Title || null,
      author: infoResult.info?.Author || null,
      text: textResult.text,
    };
  }
}
