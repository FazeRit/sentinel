import { HttpStatus } from '@nestjs/common';

export class ApiResponseDto<TData, TMeta = undefined> {
  data: TData;
  status: HttpStatus;
  message: string;
  timestamp: Date;
  path: string;
  meta?: TMeta;

  constructor(data: {
    data: TData;
    status: HttpStatus;
    message: string;
    timestamp: Date;
    path: string;
    meta?: TMeta;
  }) {
    this.data = data.data;
    this.status = data.status;
    this.message = data.message;
    this.timestamp = data.timestamp;
    this.path = data.path;
    this.meta = data.meta;
  }
}
