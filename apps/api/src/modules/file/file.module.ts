import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DeleteFileByIdUseCase } from './application/use-cases/soft-delete-file-by-id.usecase';
import { DeleteFilesUseCase } from './application/use-cases/soft-delete-files.usecase';
import { FindFileByIdUseCase } from './application/use-cases/find-file-by-id.usecase';
import { FindFilesUseCase } from './application/use-cases/find-files.usecase';
import { CreateFileUseCase } from './application/use-cases/create-file.usecase';
import { FileReadController } from './presentation/controllers/file-read.controller';
import { FileWriteController } from './presentation/controllers/file-write.controller';
import { fileProviders } from './providers/file.provider';
import { memoryStorageProviders } from './providers/memory-storage.provider';

@Module({
  imports: [MulterModule.register()],
  controllers: [FileReadController, FileWriteController],
  providers: [
    ...fileProviders,
    ...memoryStorageProviders,
    CreateFileUseCase,
    FindFileByIdUseCase,
    FindFilesUseCase,
    DeleteFileByIdUseCase,
    DeleteFilesUseCase,
  ],
})
export class FileModule {}
