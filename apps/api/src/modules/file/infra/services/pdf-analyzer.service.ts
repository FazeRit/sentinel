import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { PdfMetadata } from '../../domain/types/file.types';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse');

@Injectable()
export class PdfAnalyzerService {
  async analyze(storagePath: string): Promise<PdfMetadata> {
    const buffer = await readFile(storagePath);
    const uint8Array = new Uint8Array(buffer);

    const parser = new PDFParse(uint8Array);
    await parser.load();
    const info = await parser.getInfo();

    return {
      pageCount: parser.doc?.numPages || 0,
      title: info.info?.Title?.trim() || null,
      author: info.info?.Author?.trim() || null,
    };
  }
}
