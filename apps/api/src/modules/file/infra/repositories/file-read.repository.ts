import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { PaginatedResult } from 'src/shared/application/interfaces/paginated-result.interface';
import { FileReadPort } from '../../application/ports/database/file-read.port';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class FileReadRepository implements FileReadPort {
  constructor(private readonly prisma: PrismaService) {}

  async findFileById(id: string): Promise<FileEntity | null> {
    const file = await this.prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) return null;

    return FileMapper.toEntity(file);
  }

  async findFiles(
    limit: number = 10,
    labId?: string,
    ownerId?: string,
    cursor?: string,
  ): Promise<PaginatedResult<FileEntity>> {
    const files = await this.prisma.file.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      where: {
        labId,
        ownerId,
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const hasNextPage = files.length > limit;

    const items = hasNextPage ? files.slice(0, limit) : files;

    const lastItem = items[items.length - 1];
    const nextCursor = hasNextPage ? lastItem.id : null;

    const totalItems = await this.prisma.file.count({
      where: {
        labId,
        ownerId,
      },
    });

    return {
      items: items.map(FileMapper.toEntity),
      meta: {
        nextCursor,
        hasNextPage,
        totalItems,
      },
    };
  }

  async findFilesByIds(ids: Array<string>): Promise<FileEntity[]> {
    const files = await this.prisma.file.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return files.map(FileMapper.toEntity);
  }

  async findExpiredFiles(thesholdDate: Date): Promise<FileEntity[]> {
    const files = await this.prisma.file.findMany({
      where: {
        deletedAt: {
          lte: thesholdDate,
        },
      },
    });

    return files.map(FileMapper.toEntity);
  }

  async countFiles(labId: string, ownerId?: string): Promise<number> {
    return this.prisma.file.count({
      where: {
        labId,
        deletedAt: null,
        ...(ownerId && {
          ownerId,
        }),
      },
    });
  }
}
