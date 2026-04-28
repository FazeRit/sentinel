import { IsUUID } from 'class-validator';

export class FindFileByIdDto {
  @IsUUID()
  id: string;
}
