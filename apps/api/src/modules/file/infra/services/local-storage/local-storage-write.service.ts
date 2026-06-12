import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { Readable } from 'stream';
import { MemoryStorageWritePort } from 'src/modules/file/application/ports/storage/memory-storage-write.port';

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

  async upload(fileId: string, file: Express.Multer.File): Promise<string> {
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, {
        recursive: true,
      });
    }

    const fileName = `${fileId}-${file.originalname}`;
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
