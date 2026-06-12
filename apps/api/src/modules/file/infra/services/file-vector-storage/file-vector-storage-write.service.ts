import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/qdrant-js';
import {
  FileVector,
  FileVectorStorageWritePort,
} from 'src/modules/file/application/ports/file-vector-storage-write.port';

@Injectable()
export class FileVectorStorageWriteService implements FileVectorStorageWritePort {
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

  async saveFile(file: FileVector): Promise<void> {
    await this.saveFiles([file]);
  }

  async saveFiles(files: Array<FileVector>): Promise<void> {
    await this.client.upsert(this.collectionName, {
      points: files.map((file) => ({
        id: file.id,
        vector: file.vector,
        payload: file.payload,
      })),
    });
  }

  async deleteFile(id: string): Promise<void> {
    await this.deleteFiles([id]);
  }

  async deleteFiles(ids: Array<string>): Promise<void> {
    await this.client.delete(this.collectionName, {
      points: ids,
    });
  }
}
