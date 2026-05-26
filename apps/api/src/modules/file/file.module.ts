import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bullmq';
import { SoftDeleteFileByIdUseCase } from './application/use-cases/soft-delete-file-by-id.usecase';
import { SoftDeleteFilesUseCase } from './application/use-cases/soft-delete-files.usecase';
import { FindFileByIdUseCase } from './application/use-cases/find-file-by-id.usecase';
import { FindFilesUseCase } from './application/use-cases/find-files.usecase';
import { CreateFileUseCase } from './application/use-cases/create-file.usecase';
import { EnqueueFileProcessingUseCase } from './application/use-cases/enqueue-file-processing.usecase';
import { ProcessFileUseCase } from './application/use-cases/process-file.usecase';
import { HardDeleteFilesUseCase } from './application/use-cases/hard-delete-files.usecase';
import { CleanExpiredFilesUseCase } from './application/use-cases/clean-expired-files.usecase';
import { FileCleanUpCron } from './presentation/cron/files-cleanup.cron';
import { FileReadController } from './presentation/controllers/file-read.controller';
import { FileWriteController } from './presentation/controllers/file-write.controller';
import { FileProcessingGateway } from './presentation/gateway/file-processing.gateway';
import { fileProviders } from './providers/file.provider';
import { memoryStorageProviders } from './providers/memory-storage.provider';
import { queueProviders } from './providers/queue.provider';
import { PdfAnalyzerService } from './infra/services/pdf-analyzer.service';
import { FILE_PROCESSING_QUEUE } from './infra/constants/file.constants';

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
    CreateFileUseCase,
    EnqueueFileProcessingUseCase,
    ProcessFileUseCase,
    FindFileByIdUseCase,
    FindFilesUseCase,
    SoftDeleteFileByIdUseCase,
    SoftDeleteFilesUseCase,
    HardDeleteFilesUseCase,
    CleanExpiredFilesUseCase,
    PdfAnalyzerService,
    FileCleanUpCron,
    FileProcessingGateway,
  ],
})
export class FileModule {}
