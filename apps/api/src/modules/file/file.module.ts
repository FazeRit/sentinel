import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DeleteByIdUseCase } from './application/use-cases/delete-by-id.usecase';
import { DeleteFilesUseCase } from './application/use-cases/delete-files.usecase';
import { FindByIdUseCase } from './application/use-cases/find-by-id.usecase';
import { FindFilesUseCase } from './application/use-cases/find-files.usecase';
import { CreateFileUseCase } from './application/use-cases/create-file.usecase';
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
    CreateFileUseCase,
    FindByIdUseCase,
    FindFilesUseCase,
    DeleteByIdUseCase,
    DeleteFilesUseCase,
  ],
})
export class FileModule {}
