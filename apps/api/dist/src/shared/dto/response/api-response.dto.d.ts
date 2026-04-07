import { HttpStatus } from '@nestjs/common';
export declare class ApiResponseDto<T> {
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
    });
}
