import { HttpStatus } from '@nestjs/common';

export class ApiResponseDto<T> {
  data: T;
  status: HttpStatus;
  message: string;
  timestamp: Date;
  path: string;

  constructor(data: {
    data: T;
    status: HttpStatus;
    message: string;
    timestamp: Date;
    path: string;
  }) {
    this.data = data.data;
    this.status = data.status;
    this.message = data.message;
    this.timestamp = data.timestamp;
    this.path = data.path;
  }
}
