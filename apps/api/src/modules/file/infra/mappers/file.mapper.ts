import { File as PrismaFile } from '@prisma/client';
import { FileEntity } from '../../domain/entities/file.entity';

export class FileMapper {
  static toEntity(model: PrismaFile): FileEntity {
    return FileEntity.restore({
      id: model.id,
      ownerId: model.ownerId,
      labId: model.labId,
      name: model.name,
      bytes: model.bytes,
      mimetype: model.mimetype,
      storagePath: model.storagePath,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(fileEntity: FileEntity): PrismaFile {
    return {
      id: fileEntity.id,
      ownerId: fileEntity.ownerId,
      labId: fileEntity.labId ?? null,
      name: fileEntity.name,
      mimetype: fileEntity.mimetype,
      bytes: fileEntity.bytes,
      storagePath: fileEntity.storagePath,
      createdAt: fileEntity.createdAt,
      updatedAt: fileEntity.updatedAt,
    };
  }
}
