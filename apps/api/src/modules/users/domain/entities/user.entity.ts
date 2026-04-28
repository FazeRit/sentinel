import { randomUUID } from 'crypto';
import {
  TCreateUserProps,
  TRestoreUserProps,
  TUserRoles,
} from '../types/users.types';

export class UserEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _role: TUserRoles;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: TRestoreUserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: TCreateUserProps): UserEntity {
    const now = new Date();

    return new UserEntity({
      ...props,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: TRestoreUserProps): UserEntity {
    return new UserEntity(props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public get role(): TUserRoles {
    return this._role;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
