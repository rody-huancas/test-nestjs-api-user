// main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from '@config/swagger/swagger.config';
import { setupSecurity } from '@config/security/security.config';
import { setupValidation } from '@config/validation/validation.config';
import { envs, initializeEnvs } from '@config/env';
import { ThrottlerExceptionFilter } from '@shared/filters/throttler-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Inicializar variables de entorno
  const configService = app.get(ConfigService);
  initializeEnvs(configService);

  // Configuraciones
  const allowedOrigins = envs.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  
  setupSecurity(app, allowedOrigins);
  setupValidation(app);
  setupSwagger(app);

  // Prefijo global
  app.setGlobalPrefix('api/v1');

  // Filtros globales
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Logs
  logger.log(`[SECURITY] CORS habilitado para: ${allowedOrigins.join(', ')}`);
  logger.log(`[SECURITY] Rate limiting: 10 req/min global, 3 req/min para crear usuarios`);

  await app.listen(envs.APP_PORT, () => {
    logger.log(`[INFO] Servidor iniciado en '${envs.PUBLIC_URL}'`);
    logger.log(`[INFO] Documentación en '${envs.PUBLIC_URL}/api/docs'`);
  });
}
bootstrap();