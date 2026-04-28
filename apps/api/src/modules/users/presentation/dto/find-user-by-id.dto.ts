import { IsUUID } from 'class-validator';

export class FindUserByIdDto {
  @IsUUID()
  id: string;
}
