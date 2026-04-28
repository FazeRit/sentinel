import { IsUUID } from 'class-validator';

export class DeleteFileByIdDto {
  @IsUUID()
  id: string;
}
