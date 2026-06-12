import { Provider } from '@nestjs/common';
import { FILE_QUEUE_PORT } from '../application/ports/queue/file-queue.port';
import { FileQueueService } from '../infra/services/file-queue/file-queue.service';

export const queueProviders: Array<Provider> = [
  {
    provide: FILE_QUEUE_PORT,
    useClass: FileQueueService,
  },
];
