export const TEXT_CHUNKER_PORT = Symbol('text-chunker-port');

export interface ITextChunkerOptions {
  maxTokens?: number;
  overlapTokens?: number;
}

export abstract class TextChunkerPort {
  abstract chunkText(text: string, options?: ITextChunkerOptions): string[];
}
