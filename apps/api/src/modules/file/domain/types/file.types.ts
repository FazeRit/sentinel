export interface IFileProps {
  id: string;
  ownerId: string;
  name: string;
  bytes: number;
  mimetype: string;
  storagePath: string | null;
  labId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateFileProps = Omit<
  IFileProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TRestoreFileProps = IFileProps;
