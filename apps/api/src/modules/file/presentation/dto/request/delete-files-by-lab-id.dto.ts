import { IsUUID } from 'class-validator';

export class DeleteFilesByLabIdDto {
  @IsUUID()
  labId: string;
}
