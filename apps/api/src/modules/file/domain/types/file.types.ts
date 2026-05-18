export interface IFileProps {
  id: string;
  ownerId: string;
  name: string;
  bytes: number;
  mimetype: string;
  storagePath: string | null;
  labId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateFileProps = Omit<
  IFileProps,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type TRestoreFileProps = IFileProps;
