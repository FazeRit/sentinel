import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { homedir } from 'os';
import { join, basename, resolve } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { Readable } from 'stream';
import { MemoryStorageWritePort } from 'src/modules/file/application/ports/storage/memory-storage-write.port';

@Injectable()
export class LocalStorageWriteService implements MemoryStorageWritePort {
  private readonly baseDir: string = join(homedir(), 'sentinel', 'files');

  async delete(storagePath: string): Promise<void> {
    const resolvedPath = resolve(storagePath);
    if (!resolvedPath.startsWith(this.baseDir)) {
      throw new Error('Invalid storage path: path traversal detected');
    }

    try {
      await unlink(resolvedPath);
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

    const safeName = basename(file.originalname);
    const fileName = `${fileId}-${safeName}`;
    const fullPath = join(this.baseDir, fileName);

    if (!fullPath.startsWith(this.baseDir)) {
      throw new Error('Invalid file path: path traversal detected');
    }

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
