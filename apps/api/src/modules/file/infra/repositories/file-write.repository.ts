import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { FileWritePort } from '../../application/ports/file-write.port';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class FileWriteRepository implements FileWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(fileEntity: FileEntity): Promise<FileEntity> {
    const model = FileMapper.toModel(fileEntity);

    const file = await this.prisma.file.upsert({
      where: {
        id: model.id,
      },
      create: model,
      update: model,
    });

    return FileMapper.toEntity(file);
  }

  async softDeleteFiles(labId: string, ownerId?: string): Promise<void> {
    await this.prisma.file.updateMany({
      where: {
        labId,
        deletedAt: null,
        ...(ownerId && {
          ownerId,
        }),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hardDeleteFiles(ids: Array<string>): Promise<void> {
    await this.prisma.file.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
