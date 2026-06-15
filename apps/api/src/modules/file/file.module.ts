import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bullmq';
import { SoftDeleteFileByIdUseCase } from './application/use-cases/commands/soft-delete-file-by-id.usecase';
import { SoftDeleteFilesUseCase } from './application/use-cases/commands/soft-delete-files.usecase';
import { FindFileByIdUseCase } from './application/use-cases/queries/find-file-by-id.usecase';
import { FindFilesUseCase } from './application/use-cases/queries/find-files.usecase';
import { CreateFileUseCase } from './application/use-cases/commands/create-file.usecase';
import { ProcessFileUseCase } from './application/use-cases/commands/process-file.usecase';
import { HardDeleteFilesUseCase } from './application/use-cases/commands/hard-delete-files.usecase';
import { CleanExpiredFilesUseCase } from './application/use-cases/commands/clean-expired-files.usecase';
import { FileCleanUpCron } from './presentation/cron/files-cleanup.cron';
import { FileReadController } from './presentation/controllers/file-read.controller';
import { FileWriteController } from './presentation/controllers/file-write.controller';
import { FileProcessingGateway } from './presentation/gateway/file-processing.gateway';
import { fileProviders } from './providers/file.provider';
import { memoryStorageProviders } from './providers/memory-storage.provider';
import { queueProviders } from './providers/queue.provider';
import { fileAnalyzerProviders } from './providers/file-analyzer.provider';
import { fileVectorStorageProviders } from './providers/file-vector-storage.provider';
import { FILE_PROCESSING_QUEUE } from './infra/constants/file.constants';
import { TEXT_CHUNKER_PORT } from './application/ports/analysis/text-chunker.port';
import { textChunkerProviders } from './providers/text-chunker.provider';

@Module({
  imports: [
    MulterModule.register(),
    BullModule.registerQueue({ name: FILE_PROCESSING_QUEUE }),
  ],
  controllers: [FileReadController, FileWriteController],
  providers: [
    ...fileProviders,
    ...memoryStorageProviders,
    ...queueProviders,
    ...fileAnalyzerProviders,
    ...fileVectorStorageProviders,
    ...textChunkerProviders,
    CreateFileUseCase,
    ProcessFileUseCase,
    FindFileByIdUseCase,
    FindFilesUseCase,
    SoftDeleteFileByIdUseCase,
    SoftDeleteFilesUseCase,
    HardDeleteFilesUseCase,
    CleanExpiredFilesUseCase,
    FileCleanUpCron,
    FileProcessingGateway,
  ],
  exports: [TEXT_CHUNKER_PORT],
})
export class FileModule {}
