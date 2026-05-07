import { randomUUID } from 'crypto';
import { ISessionProps, TCreateSessionProps } from '../types/session.types';

export class SessionEntity {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _refreshToken: string;
  private readonly _ip?: string;
  private readonly _userAgent?: string;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private _revokedAt?: Date | null;

  private constructor(props: ISessionProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._refreshToken = props.refreshToken;
    this._ip = props.ip;
    this._userAgent = props.userAgent;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._revokedAt = props.revokedAt;
  }

  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  get ip() {
    return this._ip;
  }
  get userAgent() {
    return this._userAgent;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get revokedAt() {
    return this._revokedAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  public isRevoked(): boolean {
    return !!this._revokedAt;
  }

  public isActive(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }

  public revoke(): void {
    if (!this._revokedAt) {
      this._revokedAt = new Date();
    }
  }

  static create(props: TCreateSessionProps): SessionEntity {
    return new SessionEntity({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revokedAt: null,
    });
  }

  static restore(props: ISessionProps): SessionEntity {
    return new SessionEntity(props);
  }
}
