import { IsUUID, IsString, IsOptional } from 'class-validator';

// TODO: look for any solution for file
export class CreateFileDto {
  file: any;

  @IsUUID()
  labId: string;

  @IsString()
  @IsOptional()
  originalName?: string;
}
