import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FILE_PROCESSING_QUEUE } from '../../infra/constants/file.constants';
import { ProcessFileUseCase } from '../../application/use-cases/commands/process-file.usecase';

@Processor(FILE_PROCESSING_QUEUE)
export class FileProcessingGateway extends WorkerHost {
  constructor(private readonly processFileUseCase: ProcessFileUseCase) {
    super();
  }

  async process(
    job: Job<{
      fileId: string;
    }>,
  ): Promise<void> {
    await this.processFileUseCase.execute(job.data.fileId);
  }
}
