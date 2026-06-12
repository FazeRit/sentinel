export const FILE_VECTOR_STORAGE_READ_PORT = Symbol('file-vector-storage-read');

export interface FileVectorPayload {
  [key: string]: unknown;
  file_id: string;
  lab_id: string;
  user_id: string;
  pageCount?: number;
  title?: string;
  author?: string;
}

export interface VectorStorageFilter {
  lab_id?: string;
  user_id?: string;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  payload: FileVectorPayload;
}

export abstract class FileVectorStorageReadPort {
  abstract findFile(
    queryVector: number[],
    filter?: VectorStorageFilter,
  ): Promise<VectorSearchResult | null>;

  abstract findFiles(
    queryVector: number[],
    topK: number,
    filter?: VectorStorageFilter,
  ): Promise<Array<VectorSearchResult>>;
}
