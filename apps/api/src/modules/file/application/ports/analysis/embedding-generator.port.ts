export const EMBEDDING_GENERATOR_PORT = Symbol('embedding-generator-port');

export abstract class EmbeddingGeneratorPort {
  abstract generate(text: string): Promise<number[]>;
  abstract generateBatch(texts: string[]): Promise<number[][]>;
}
