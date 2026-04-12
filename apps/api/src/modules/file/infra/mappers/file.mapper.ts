import { File as PrismaFile } from '@prisma/client';
import { FileEntity } from '../../domain/entities/file.entity';

export class FileMapper {
  static toDomain(model: PrismaFile): FileEntity {
    return FileEntity.restore({
      id: model.id,
      name: model.name,
      size: model.size,
      mimetype: model.mimetype,
      storagePath: model.storagePath,
      labId: model.labId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(domain: FileEntity): PrismaFile {
    return {
      id: domain.id,
      name: domain.name,
      mimetype: domain.mimetype,
      size: domain.size,
      labId: domain.labId ?? null,
      storagePath: domain.storagePath,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
