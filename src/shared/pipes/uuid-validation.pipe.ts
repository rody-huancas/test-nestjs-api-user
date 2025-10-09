import { BadRequestException, Injectable, ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: (error) =>
        new BadRequestException({
          statusCode: 400,
          message   : 'El identificador proporcionado no es un UUID válido. Por favor, asegúrese de enviar un ID con el formato correcto.',
          error     : 'UUID Validation Error',
          details   : error || undefined,
        }),
    });
  }
}
