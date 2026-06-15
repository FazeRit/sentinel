import { Provider } from '@nestjs/common';
import { EMBEDDING_GENERATOR_PORT } from '../application/ports/analysis/embedding-generator.port';
import { NomicEmbeddingGeneratorService } from '../infra/services/embedding-generator/nomic-embedding-generator.service';

export const embeddingGeneratorProviders: Provider[] = [
  {
    provide: EMBEDDING_GENERATOR_PORT,
    useClass: NomicEmbeddingGeneratorService,
  },
];
