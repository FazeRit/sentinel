import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('chat-message-queue')
export class ChatMessageProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<void> {}
}
