import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EmbeddingGeneratorPort } from '../../../application/ports/analysis/embedding-generator.port';

@Injectable()
export class NomicEmbeddingGeneratorService implements EmbeddingGeneratorPort {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY') || 'ollama';
    const baseURL =
      this.config.get<string>('OPENAI_BASE_URL') || 'http://localhost:11434/v1';
    this.model =
      this.config.get<string>('EMBEDDING_MODEL') ||
      'text-embedding-nomic-embed-text-v2';

    this.openai = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async generate(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: text,
    });
    return response.data[0].embedding;
  }

  async generateBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: texts,
      dimensions: 768,
    });
    return response.data.map((item) => item.embedding);
  }
}
