import { Module } from '@nestjs/common';
import { fileProviders } from './presentation/providers/file.provider';
import { memoryStorageProviders } from './presentation/providers/memory-storage.provider';
import { UploadFileUseCase } from './application/use-cases/upload-file.usecase';

@Module({
  providers: [...fileProviders, ...memoryStorageProviders, UploadFileUseCase],
})
export class FileModule {}
