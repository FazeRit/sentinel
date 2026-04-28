import { IsUUID } from 'class-validator';

export class DeleteUserByIdDto {
  @IsUUID()
  id: string;
}
