import { IsUUID } from 'class-validator';

export class FindFilesByLabIdDto {
  @IsUUID()
  labId: string;
}
