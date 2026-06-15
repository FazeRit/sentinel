import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/qdrant-js';
import {
  FileVectorStorageReadPort,
  IFileVectorPayload,
  IVectorSearchResult,
  IVectorStorageFilter,
} from 'src/modules/file/application/ports/vector/file-vector-storage-read.port';

@Injectable()
export class FileVectorStorageReadService implements FileVectorStorageReadPort {
  private readonly collectionName: string;
  private readonly client: QdrantClient;

  constructor(private readonly config: ConfigService) {
    this.collectionName = this.config.getOrThrow('FILE_COLLECTION_NAME');

    const apiKey = this.config.getOrThrow<string>('VECTOR_DATABASE_API_KEY');
    const url = this.config.getOrThrow<string>('VECTOR_DATABASE_URL');

    this.client = new QdrantClient({
      url,
      apiKey,
    });
  }

  async findFile(
    queryVector: number[],
    filter?: IVectorStorageFilter,
  ): Promise<IVectorSearchResult | null> {
    const results = await this.findFiles(queryVector, 1, filter);
    return results.length > 0 ? results[0] : null;
  }

  async findFiles(
    queryVector: number[],
    topK: number,
    filter?: IVectorStorageFilter,
  ): Promise<IVectorSearchResult[]> {
    const results = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit: topK,
      filter: filter
        ? {
            must: [
              ...(filter.lab_id
                ? [
                    {
                      key: 'lab_id',
                      match: {
                        value: filter.lab_id,
                      },
                    },
                  ]
                : []),
              ...(filter.user_id
                ? [
                    {
                      key: 'user_id',
                      match: {
                        value: filter.user_id,
                      },
                    },
                  ]
                : []),
            ],
          }
        : undefined,
    });

    return results.map((result) => ({
      id: String(result.id),
      score: result.score,
      payload: result.payload as unknown as IFileVectorPayload,
    }));
  }
}
