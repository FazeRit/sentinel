import { Injectable } from '@nestjs/common';
import { LlmChatPort } from '../../application/ports/llm-chat.port';

@Injectable()
export class LlmChatService implements LlmChatPort {}
