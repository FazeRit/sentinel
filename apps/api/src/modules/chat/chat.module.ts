import { Module } from '@nestjs/common';
import { AskAiGateway } from './presentation/gateways/ask-ai.gateway';
import { ChatMessageProcessor } from './presentation/processors/chat-message.processor';
import { LlmChatPort } from './application/ports/llm-chat.port';
import { LlmChatService } from './infra/services/llm-chat.service';
import { ChatMessageQueuePort } from './application/ports/chat-message-queue.port';
import { ChatMessageQueueService } from './infra/services/chat-message-queue.service';

@Module({
  providers: [
    AskAiGateway,
    ChatMessageProcessor,
    {
      provide: LlmChatPort,
      useClass: LlmChatService,
    },
    {
      provide: ChatMessageQueuePort,
      useClass: ChatMessageQueueService,
    },
  ],
})
export class ChatModule {}
