import { ConfigService } from '@nestjs/config';
import { getConfigNumber, getConfigString } from '@shared/utils/env.utils';

let configService: ConfigService;

export const initializeEnvs = (config: ConfigService) => {
  configService = config;
};

export const envs = {
  // APP
  get NODE_ENV()        { return getConfigString(configService, 'NODE_ENV', 'development') },
  get APP_PORT()        { return getConfigNumber(configService, 'APP_PORT', 3000)          },
  get PUBLIC_URL()      { return getConfigString(configService, 'PUBLIC_URL')              },
  get ALLOWED_ORIGINS() { return getConfigString(configService, 'ALLOWED_ORIGINS')         }
};