import { Provider } from '@nestjs/common';
import { TEXT_CHUNKER_PORT } from '../application/ports/analysis/text-chunker.port';
import { NomicTextChunkerService } from '../infra/services/text-chunker/nomic-text-chunker.service';

export const textChunkerProviders: Provider[] = [
  {
    provide: TEXT_CHUNKER_PORT,
    useClass: NomicTextChunkerService,
  },
];
