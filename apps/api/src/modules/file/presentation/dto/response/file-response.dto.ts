import { Expose } from 'class-transformer';
import { FileEntity } from '../../../domain/entities/file.entity';

export class FileResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bytes: number;

  @Expose()
  mimetype: string;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<FileResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: FileEntity): FileResponseDto {
    return new FileResponseDto({
      id: entity.id,
      name: entity.name,
      bytes: entity.bytes,
      mimetype: entity.mimetype,
      createdAt: entity.createdAt,
    });
  }
}
