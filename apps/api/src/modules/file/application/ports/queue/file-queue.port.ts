export const FILE_QUEUE_PORT = Symbol('file-queue-port');

export abstract class FileQueuePort {
  abstract enqueueProcessing(fileId: string): Promise<void>;
}
