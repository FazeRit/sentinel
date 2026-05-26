import { Inject, Injectable } from '@nestjs/common';
import { FILE_QUEUE_PORT, FileQueuePort } from '../ports/file-queue.port';

@Injectable()
export class EnqueueFileProcessingUseCase {
  constructor(
    @Inject(FILE_QUEUE_PORT)
    private readonly fileQueue: FileQueuePort,
  ) {}

  async execute(fileId: string): Promise<void> {
    await this.fileQueue.enqueueProcessing(fileId);
  }
}
