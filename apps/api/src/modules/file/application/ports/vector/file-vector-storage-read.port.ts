export const FILE_VECTOR_STORAGE_READ_PORT = Symbol('file-vector-storage-read');

export interface IFileVectorPayload {
  [key: string]: unknown;
  file_id: string;
  lab_id: string;
  user_id: string;
  pageCount?: number;
  title?: string;
  author?: string;
}

export interface IVectorStorageFilter {
  lab_id?: string;
  user_id?: string;
}

export interface IVectorSearchResult {
  id: string;
  score: number;
  payload: IFileVectorPayload;
}

export abstract class FileVectorStorageReadPort {
  abstract findFile(
    queryVector: number[],
    filter?: IVectorStorageFilter,
  ): Promise<IVectorSearchResult | null>;

  abstract findFiles(
    queryVector: number[],
    topK: number,
    filter?: IVectorStorageFilter,
  ): Promise<Array<IVectorSearchResult>>;
}
