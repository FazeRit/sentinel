export interface FileProps {
  id: string;
  name: string;
  bytes: number;
  mimetype: string;
  storagePath: string | null;
  labId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFileProps = Omit<FileProps, 'id' | 'createdAt' | 'updatedAt'>;

export type RestoreFileProps = FileProps;
