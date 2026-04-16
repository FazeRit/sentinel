import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';
import { FileReadPort } from '../../application/ports/file-read.port';

@Injectable()
export class FileReadRepository implements FileReadPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FileEntity | null> {
    const file = await this.prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) return null;

    return FileMapper.toEntity(file);
  }

  async findByLabId(labId: string): Promise<Array<FileEntity> | null> {
    const files = await this.prisma.file.findMany({
      where: {
        labId,
      },
    });

    if (!files) return null;

    return files.map((file) => FileMapper.toEntity(file));
  }
}
