import { AppModule } from 'src/app.module';
import { useContainer } from 'class-validator';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setupValidation = (app: INestApplication) => {
  // Permitir inyección de dependencias en class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist           : true,
      forbidNonWhitelisted: true,
      transform           : true,
      transformOptions    : { enableImplicitConversion: true },
    }),
  );
};