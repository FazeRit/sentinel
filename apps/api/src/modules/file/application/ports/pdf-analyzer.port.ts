import { PdfMetadata } from '../../domain/types/file.types';

export const PDF_ANALYZER_PORT = Symbol('pdf-analyzer-port');

export abstract class PdfAnalyzerPort {
  abstract analyze(storagePath: string): Promise<PdfMetadata>;
}
