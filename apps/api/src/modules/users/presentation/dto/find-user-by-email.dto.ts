import { IsEmail, IsUUID } from 'class-validator';

export class FindUserByEmailDto {
  @IsUUID()
  @IsEmail()
  email: string;
}
