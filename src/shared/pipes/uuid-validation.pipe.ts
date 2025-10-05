import { BadRequestException, Injectable, ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('El ID proporcionado no tiene un formato UUID válido'),
    });
  }
}
