import { Provider } from '@nestjs/common';
import { FILE_QUEUE_PORT } from '../application/ports/file-queue.port';
import { ProcessFileQueueService } from '../infra/services/process-file-queue.service';

export const queueProviders: Array<Provider> = [
  {
    provide: FILE_QUEUE_PORT,
    useClass: ProcessFileQueueService,
  },
];
