export type TUserRoles = 'ADMIN' | 'USER';

export const USER_ROLES: Record<string, TUserRoles> = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export interface IUserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: TUserRoles;
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateUserProps = Omit<
  IUserProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TRestoreUserProps = IUserProps;
