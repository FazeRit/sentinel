import { Provider } from '@nestjs/common';
import { TOKEN_PROVIDER_PORT } from 'src/modules/sessions/application/ports/token-provider.port';
import { JwtAdapterService } from 'src/modules/sessions/infra/services/jwt/jwt-adapter.service';

export const tokenProviders: Array<Provider> = [
  {
    provide: TOKEN_PROVIDER_PORT,
    useClass: JwtAdapterService,
  },
];
