"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseDto = void 0;
class ApiResponseDto {
    constructor(data) {
        this.data = data.data;
        this.status = data.status;
        this.message = data.message;
        this.timestamp = data.timestamp;
        this.path = data.path;
    }
}
exports.ApiResponseDto = ApiResponseDto;
//# sourceMappingURL=api-response.dto.js.map