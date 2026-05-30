import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { UserWritePort } from '../../application/ports/user-write.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserWriteRepository implements UserWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async saveUser(userEntity: UserEntity): Promise<UserEntity> {
    const model = UserMapper.toModel(userEntity);

    const user = await this.prisma.user.create({
      data: model,
    });

    return UserMapper.toEntity(user);
  }

  async updateUser(userEntity: UserEntity): Promise<UserEntity> {
    const model = UserMapper.toModel(userEntity);

    const user = await this.prisma.user.update({
      where: {
        id: model.id,
      },
      data: model,
    });

    return UserMapper.toEntity(user);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
