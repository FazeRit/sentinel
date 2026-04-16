import { IsUUID } from 'class-validator';

export class DeleteFileDto {
  @IsUUID()
  id: string;
}
