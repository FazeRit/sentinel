import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';
import { FileWritePort } from '../../application/ports/file-write.port';

@Injectable()
export class FileWriteRepository implements FileWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async save(fileEntity: FileEntity): Promise<void> {
    const model = FileMapper.toModel(fileEntity);

    await this.prisma.file.create({
      data: model,
    });
  }

  async update(fileEntity: FileEntity): Promise<void> {
    const model = FileMapper.toModel(fileEntity);

    await this.prisma.file.update({
      where: {
        id: model.id,
      },
      data: model,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.file.delete({
      where: {
        id,
      },
    });
  }

  async deleteByLabId(labId: string): Promise<void> {
    await this.prisma.file.deleteMany({
      where: {
        labId,
      },
    });
  }
}
