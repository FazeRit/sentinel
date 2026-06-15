import { Injectable } from '@nestjs/common';
// @ts-expect-error js-tokenizer has no type definitions
import * as tokenize from 'js-tokenizer';
import {
  ITextChunkerOptions,
  TextChunkerPort,
} from '../../../application/ports/analysis/text-chunker.port';

@Injectable()
export class NomicTextChunkerService implements TextChunkerPort {
  private readonly DEFAULT_MAX_TOKENS = 768;
  private readonly DEFAULT_OVERLAP_TOKENS = 50;

  chunkText(text: string, options?: ITextChunkerOptions): string[] {
    if (!text || text.trim() === '') {
      return [];
    }

    const maxTokens = options?.maxTokens ?? this.DEFAULT_MAX_TOKENS;
    const overlapTokens = options?.overlapTokens ?? this.DEFAULT_OVERLAP_TOKENS;

    if (maxTokens <= 0) {
      throw new Error('maxTokens must be a positive integer');
    }
    if (overlapTokens < 0 || overlapTokens >= maxTokens) {
      throw new Error(
        'overlapTokens must be non-negative and less than maxTokens',
      );
    }

    const tokens = tokenize(text) as string[];
    const chunks: string[] = [];

    let i = 0;
    while (i < tokens.length) {
      const chunkTokens = tokens.slice(i, i + maxTokens);
      if (chunkTokens.length === 0) {
        break;
      }

      chunks.push(chunkTokens.join(''));

      const step = maxTokens - overlapTokens;
      i += step;

      if (step <= 0) {
        break;
      }
    }

    return chunks;
  }
}
