import { Provider } from '@nestjs/common';
import { PDF_ANALYZER_PORT } from '../application/ports/pdf-analyzer.port';
import { PdfAnalyzerService } from '../infra/services/pdf-analyzer.service';

export const pdfAnalyzerProviders: Array<Provider> = [
  {
    provide: PDF_ANALYZER_PORT,
    useClass: PdfAnalyzerService,
  },
];
