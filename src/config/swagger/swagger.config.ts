import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Usuarios')
    .setDescription(
      'API REST con prácticas de seguridad OWASP:\n\n' +
      '- Validación y sanitización de inputs\n' +
      '- Rate limiting\n' +
      '- Prevención de inyección SQL\n' +
      '- Headers de seguridad con Helmet\n' +
      '- Hash de contraseñas con bcrypt'
    )
    .setVersion('1.0')
    .addServer('/api/v1', 'Servidor principal')
    .addTag('users', 'Endpoints para gestión de usuarios')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Docs - Gestión de Usuarios',
    customCss: '.swagger-ui .topbar { display: none }',
  });
};