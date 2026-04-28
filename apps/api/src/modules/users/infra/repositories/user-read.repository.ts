import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ApiPaginationMetaResponseDto } from 'src/shared/dto/response/api-paginition-meta-response.dto';
import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { UserReadPort } from '../../application/ports/user-read.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserReadRepository implements UserReadPort {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return UserMapper.toEntity(user);
  }

  async findUsers(
    limit: number = 10,
    cursor?: string,
  ): Promise<PaginationResult<UserEntity>> {
    const files = await this.prisma.user.findMany({
      take: limit + 1,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        id: 'asc',
      },
    });

    const hasNextPage = files.length > limit;

    const items = hasNextPage ? files.slice(0, limit) : files;

    const lastItem = items[items.length - 1];
    const nextCursor = hasNextPage ? lastItem.id : null;

    const totalItems = await this.prisma.file.count();

    return {
      items: items.map(UserMapper.toEntity),
      meta: new ApiPaginationMetaResponseDto(
        nextCursor ?? undefined,
        hasNextPage,
        totalItems,
      ),
    };
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return UserMapper.toEntity(user);
  }
}
