import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  FILE_READ_PORT,
  FileReadPort,
} from '../../ports/database/file-read.port';
import {
  FILE_WRITE_PORT,
  FileWritePort,
} from '../../ports/database/file-write.port';
import {
  FILE_VECTOR_STORAGE_WRITE_PORT,
  FileVectorStorageWritePort,
} from '../../ports/vector/file-vector-storage-write.port';
import {
  FILE_ANALYZER_PORT,
  FileAnalyzerPort,
} from '../../ports/analysis/file-analyzer.port';
import {
  TEXT_CHUNKER_PORT,
  TextChunkerPort,
} from '../../ports/analysis/text-chunker.port';
import {
  EMBEDDING_GENERATOR_PORT,
  EmbeddingGeneratorPort,
} from '../../ports/analysis/embedding-generator.port';
import { chunkArray } from 'src/shared/utils/chunk-array.util';

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
    @Inject(TEXT_CHUNKER_PORT)
    private readonly textChunker: TextChunkerPort,
    @Inject(EMBEDDING_GENERATOR_PORT)
    private readonly embeddingGenerator: EmbeddingGeneratorPort,
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

      const { text, pageCount, author, title } =
        await this.fileAnalyzer.analyze(file.storagePath);

      file.setMetadata({
        text,
        pageCount,
        author,
        title,
      });

      const chunks = await this.textChunker.chunkText(text);

      const textBatches: string[][] = chunkArray(chunks, 100);

      for (const textBatch of textBatches) {
        const vectors = await this.embeddingGenerator.generateBatch(textBatch);

        const batchVectors = textBatch
          .map((chunkText, i) => ({
            id: uuidv4(),
            vector: vectors[i],
            payload: {
              file_id: file.id,
              lab_id: file.labId || '',
              user_id: file.ownerId,
              pageCount: file.pageCount ?? undefined,
              title: file.title ?? undefined,
              author: file.author ?? undefined,
              text: chunkText,
            },
          }))
          .filter((item) => !!item.vector);

        if (batchVectors.length > 0) {
          await this.vectorStorage.saveFiles(batchVectors);
        }
      }

      file.markAsReady();
    } catch {
      file.markAsFailed();
    }

    await this.fileWriteRepo.saveFile(file);
  }
}
