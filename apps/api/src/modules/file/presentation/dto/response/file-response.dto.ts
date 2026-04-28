import { Expose } from 'class-transformer';
import { FileEntity } from '../../../domain/entities/file.entity';

export class FileResponseDto {
  @Expose()
  id: string;

  @Expose()
  ownerId: string;

  @Expose()
  labId: string | null;

  @Expose()
  name: string;

  @Expose()
  bytes: number;

  @Expose()
  mimetype: string;

  @Expose()
  storagePath: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<FileResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: FileEntity): FileResponseDto {
    return new FileResponseDto({
      id: entity.id,
      name: entity.name,
      ownerId: entity.ownerId,
      labId: entity.labId,
      storagePath: entity.storagePath,
      bytes: entity.bytes,
      mimetype: entity.mimetype,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
