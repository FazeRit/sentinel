import { randomUUID } from 'crypto';
import { TCreateFileProps, TRestoreFileProps } from '../types/file.types';

export class FileEntity {
  private readonly _id: string;
  private readonly _ownerId: string;
  private readonly _labId: string | null;
  private readonly _name: string;
  private readonly _bytes: number;
  private readonly _mimetype: string;
  private _storagePath: string | null;
  private _deletedAt: Date | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: TRestoreFileProps) {
    this._id = props.id;
    this._ownerId = props.ownerId;
    this._labId = props.labId;
    this._name = props.name;
    this._bytes = props.bytes;
    this._mimetype = props.mimetype;
    this._storagePath = props.storagePath;
    this._deletedAt = props.deletedAt || null;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  public static create(props: TCreateFileProps): FileEntity {
    const now = new Date();

    return new FileEntity({
      ...props,
      id: randomUUID(),
      storagePath: props.storagePath ?? null,
      labId: props.labId ?? null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  public get id(): string {
    return this._id;
  }
  public get ownerId(): string {
    return this._ownerId;
  }
  public get name(): string {
    return this._name;
  }
  public get bytes(): number {
    return this._bytes;
  }
  public get mimetype(): string {
    return this._mimetype;
  }
  public get storagePath(): string | null {
    return this._storagePath;
  }
  public get deletedAt(): Date | null {
    return this._deletedAt;
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

  public static restore(props: TRestoreFileProps): FileEntity {
    return new FileEntity(props);
  }

  public softDelete(): void {
    if (this.isDeleted()) return;
    this._deletedAt = new Date();
  }

  public setStoragePath(path: string): void {
    if (!path) throw new Error('Storage path is required');

    this._storagePath = path;
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  public isPdf(): boolean {
    return this._mimetype === 'application/pdf';
  }

  public validateSize(maxSizeMb: number): boolean {
    const BYTES_IN_MB = 1024 * 1024;
    return this._bytes > 0 && this._bytes <= maxSizeMb * BYTES_IN_MB;
  }
}
