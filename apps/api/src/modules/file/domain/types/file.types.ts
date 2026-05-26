export enum FileStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export interface PdfMetadata {
  pageCount: number;
  title: string | null;
  author: string | null;
}

export interface IFileProps {
  id: string;
  ownerId: string;
  name: string;
  bytes: number;
  mimetype: string;
  storagePath: string | null;
  labId: string | null;
  status: FileStatus;
  pageCount: number | null;
  title: string | null;
  author: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateFileProps = Omit<
  IFileProps,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'status'
  | 'pageCount'
  | 'title'
  | 'author'
>;

export type TRestoreFileProps = IFileProps;
