import { FileMetadata } from '../../domain/types/file.types';

export const FILE_ANALYZER_PORT = Symbol('file-analyzer-port');

export abstract class FileAnalyzerPort {
  abstract analyze(storagePath: string): Promise<FileMetadata>;
}
