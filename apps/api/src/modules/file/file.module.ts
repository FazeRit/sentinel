import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DeleteFileUseCase } from './application/use-cases/delete-file.usecase';
import { DeleteFilesUseCase } from './application/use-cases/delete-files.usecase';
import { FindFileUseCase } from './application/use-cases/find-file.usecase';
import { FindFilesUseCase } from './application/use-cases/find-files.usecase';
import { UploadFileUseCase } from './application/use-cases/save-file.usecase';
import { FileReadController } from './presentation/controllers/file-read.controller';
import { FileWriteController } from './presentation/controllers/file-write.controller';
import { fileProviders } from './presentation/providers/file.provider';
import { memoryStorageProviders } from './presentation/providers/memory-storage.provider';

@Module({
  imports: [MulterModule.register()],
  controllers: [FileReadController, FileWriteController],
  providers: [
    ...fileProviders,
    ...memoryStorageProviders,
    UploadFileUseCase,
    FindFileUseCase,
    FindFilesUseCase,
    DeleteFileUseCase,
    DeleteFilesUseCase,
  ],
})
export class FileModule {}
