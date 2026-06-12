import { Provider } from '@nestjs/common';
import { FILE_ANALYZER_PORT } from '../application/ports/file-analyzer.port';
import { FileAnalyzerService } from '../infra/services/file-analyzer/file-analyzer.service';

export const fileAnalyzerProviders: Array<Provider> = [
  {
    provide: FILE_ANALYZER_PORT,
    useClass: FileAnalyzerService,
  },
];
