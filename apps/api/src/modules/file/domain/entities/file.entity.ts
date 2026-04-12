import { randomUUID } from 'crypto';
import { CreateFileProps, RestoreFileProps } from '../types/file.types';

export class FileEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _size: number;
  private readonly _mimetype: string;
  private _storagePath: string | null;
  private readonly _labId: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: RestoreFileProps) {
    this._id = props.id;
    this._name = props.name;
    this._size = props.size;
    this._mimetype = props.mimetype;
    this._storagePath = props.storagePath;
    this._labId = props.labId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get size(): number {
    return this._size;
  }
  public get mimetype(): string {
    return this._mimetype;
  }
  public get storagePath(): string | null {
    return this._storagePath;
  }
  public get labId(): string | null {
    return this._labId;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(props: CreateFileProps): FileEntity {
    const now = new Date();
    return new FileEntity({
      ...props,
      id: randomUUID(),
      storagePath: props.storagePath ?? null,
      labId: props.labId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: RestoreFileProps): FileEntity {
    return new FileEntity(props);
  }

  public setStoragePath(path: string): void {
    if (!path) throw new Error('Storage path is required');

    this._storagePath = path;
  }

  public isPdf(): boolean {
    return this._mimetype === 'application/pdf';
  }

  public validateSize(maxSizeMb: number): boolean {
    const BYTES_IN_MB = 1024 * 1024;
    return this._size > 0 && this._size <= maxSizeMb * BYTES_IN_MB;
  }
}
