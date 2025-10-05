import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';

export const setupSecurity = (app: INestApplication, allowedOrigins: string[]) => {
  // Helmet
  app.use(helmet());

  // CORS
  app.enableCors({
    origin     : allowedOrigins,
    methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
};