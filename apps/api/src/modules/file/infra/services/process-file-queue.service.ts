import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FileQueuePort } from '../../application/ports/file-queue.port';
import { FILE_PROCESSING_QUEUE } from '../constants/file.constants';

@Injectable()
export class ProcessFileQueueService implements FileQueuePort {
  constructor(
    @InjectQueue(FILE_PROCESSING_QUEUE)
    private readonly queue: Queue,
  ) {}

  async enqueueProcessing(fileId: string): Promise<void> {
    await this.queue.add('process-file', {
      fileId,
    });
  }
}
