import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { FileEntity } from '../../domain/entities/file.entity';
import { pipeline, Readable } from 'stream';
import { homedir } from 'os';
import { join } from 'path';
import { MemoryStorageWritePort } from '../../application/ports/memory-storage-write.port';
import { existsSync, mkdirSync, createWriteStream } from 'fs';

@Injectable()
export class LocalStorageWriteService implements MemoryStorageWritePort {
  private readonly baseDir: string = join(homedir(), 'sentinel', 'files');

  async delete(storagePath: string): Promise<void> {
    try {
      await unlink(storagePath);
    } catch (error) {
      throw error;
    }
  }

  async upload(domain: FileEntity, file: Express.Multer.File): Promise<string> {
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, {
        recursive: true,
      });
    }

    const fileName = `${domain.id}-${file.originalname}`;
    const fullPath = join(this.baseDir, fileName);

    const fileStream = Readable.from(file.buffer);

    const writeStream = createWriteStream(fullPath);

    try {
      await pipeline(fileStream, writeStream);

      return fullPath;
    } catch (error) {
      if (existsSync(fullPath)) await unlink(fullPath);

      throw new Error(`Failed to save file to disk: ${error.message}`);
    }
  }
}
