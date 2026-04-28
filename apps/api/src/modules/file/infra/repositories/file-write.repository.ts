import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { FileWritePort } from '../../application/ports/file-write.port';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class FileWriteRepository implements FileWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(fileEntity: FileEntity): Promise<FileEntity> {
    const model = FileMapper.toModel(fileEntity);

    const file = await this.prisma.file.create({
      data: model,
    });

    return FileMapper.toEntity(file);
  }

  async updateFile(fileEntity: FileEntity): Promise<FileEntity> {
    const model = FileMapper.toModel(fileEntity);

    const file = await this.prisma.file.update({
      where: {
        id: model.id,
      },
      data: model,
    });

    return FileMapper.toEntity(file);
  }

  async deleteFileById(id: string): Promise<void> {
    await this.prisma.file.delete({
      where: {
        id,
      },
    });
  }

  async deleteFiles(labId: string, ownerId?: string): Promise<void> {
    await this.prisma.file.deleteMany({
      where: {
        labId,
        ...(ownerId && {
          ownerId,
        }),
      },
    });
  }
}
