import { Injectable } from '@nestjs/common';
import { ChatMessageQueuePort } from '../../application/ports/chat-message-queue.port';

@Injectable()
export class ChatMessageQueueService implements ChatMessageQueuePort {}
