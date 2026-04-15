import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { FindFileUseCase } from '../../application/use-cases/find-file.usecase';
import { ApiResponseDto } from 'src/shared/dto/response/api-response.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';
import { FindFilesByLabIdUseCase } from '../../application/use-cases/find-files-by-lab-id.usecase';
import { FindFileDto } from '../dto/request/find-file.dto';
import { FindFilesByLabIdDto } from '../dto/request/find-files-by-lab-id.dto';

@Controller('files')
export class FileReadController {
  constructor(
    private readonly findFileUseCase: FindFileUseCase,
    private readonly findFilesByLabIdUseCase: FindFilesByLabIdUseCase,
  ) {}

  @Get()
  async findFilesByLabId(
    @Param() dto: FindFilesByLabIdDto,
  ): Promise<ApiResponseDto<Array<FileResponseDto>>> {
    const { labId } = dto;

    const entities = await this.findFilesByLabIdUseCase.execute(labId);

    const data = entities.map((entity) => FileResponseDto.fromEntity(entity));

    return new ApiResponseDto<Array<FileResponseDto>>({
      data,
      status: HttpStatus.OK,
      message: 'Files retrieved successfully',
      timestamp: new Date(),
      path: '/files',
    });
  }

  @Get('/:id')
  async findFile(
    @Param() dto: FindFileDto,
  ): Promise<ApiResponseDto<FileResponseDto>> {
    const { id } = dto;

    const fileEntity = await this.findFileUseCase.execute(id);

    const data = FileResponseDto.fromEntity(fileEntity);

    const response = new ApiResponseDto<FileResponseDto>({
      data,
      status: HttpStatus.OK,
      message: 'File found successfully',
      timestamp: new Date(),
      path: `/files/${id}`,
    });

    return response;
  }
}
