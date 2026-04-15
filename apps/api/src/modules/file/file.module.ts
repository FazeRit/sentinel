import { Module } from '@nestjs/common';
import { fileProviders } from './presentation/providers/file.provider';
import { memoryStorageProviders } from './presentation/providers/memory-storage.provider';
import { UploadFileUseCase } from './application/use-cases/upload-file.usecase';
import { MulterModule } from '@nestjs/platform-express';
import { FileReadController } from './presentation/controllers/file-read.controller';
import { FileWriteController } from './presentation/controllers/file-write.controller';
import { FindFileUseCase } from './application/use-cases/find-file.usecase';
import { FindFilesByLabIdUseCase } from './application/use-cases/find-files-by-lab-id.usecase';

@Module({
  imports: [MulterModule.register()],
  controllers: [FileReadController, FileWriteController],
  providers: [
    ...fileProviders,
    ...memoryStorageProviders,
    UploadFileUseCase,
    FindFileUseCase,
    FindFilesByLabIdUseCase,
  ],
})
export class FileModule {}
