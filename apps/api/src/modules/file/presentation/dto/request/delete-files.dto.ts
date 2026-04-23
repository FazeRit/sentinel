import { IsOptional, IsUUID } from 'class-validator';

export class DeleteFilesDto {
  @IsUUID()
  labId: string;

  @IsUUID()
  @IsOptional()
  ownerId?: string;
}
