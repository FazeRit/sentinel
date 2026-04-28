import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserMapper {
  static toEntity(model: PrismaUser): UserEntity {
    return UserEntity.restore({
      id: model.id,
      name: model.name,
      email: model.email,
      password: model.password,
      role: model.role,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(userEntity: UserEntity): PrismaUser {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }
}
