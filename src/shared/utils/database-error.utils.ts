import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export const DatabaseErrorHandlers = {
  // Error 23503: Violación de clave foránea
  handleForeignKeyError: (tableName: string) => {
    throw new BadRequestException(
      `No se puede realizar la operación en '${tableName}' porque está siendo referenciado en otro módulo.`,
    );
  },

  // Error 23505: Violación de unicidad (duplicados)
  handleUniqueViolation: (field: string, value: string) => {
    throw new ConflictException(
      `El valor '${value}' para el campo '${field}' ya está en uso.`,
    );
  },

  // Error 23502: Violación de NOT NULL
  handleNotNullViolation: (field: string) => {
    throw new BadRequestException(
      `El campo '${field}' es obligatorio y no puede ser nulo.`,
    );
  },

  // Error 22P02: Tipo de dato incorrecto (ej: string vs number)
  handleInvalidDataType: (field: string, expectedType: string) => {
    throw new BadRequestException(
      `El campo '${field}' debe ser de tipo ${expectedType}.`,
    );
  },

  // Error genérico de base de datos
  handleDatabaseError: (error: any, context: string) => {
    console.error(`Database Error (${context}):`, error);
    throw new InternalServerErrorException(
      `Ocurrió un error inesperado al procesar ${context}.`,
    );
  },

  // Registro no encontrado
  handleNotFound: (entityName: string, id: string | number) => {
    throw new NotFoundException(
      `${entityName} con ID ${id} no encontrado o inactivo.`,
    );
  },
};

// Función para manejar errores automáticamente
export function handleDatabaseExceptions(context: string) {
  return (error: any) => {
    switch (error.code) {
      case '23503':
        DatabaseErrorHandlers.handleForeignKeyError(context);
        break;
      case '23505':
        // Extrae el campo duplicado del mensaje de error (puedes personalizar esto)
        const field = error.detail?.match(/Key \((.*?)\)=/)?.[1] || 'campo';
        DatabaseErrorHandlers.handleUniqueViolation(
          field,
          error.parameters?.[0],
        );
        break;
      case '23502':
        const nullField = error.column || 'campo';
        DatabaseErrorHandlers.handleNotNullViolation(nullField);
        break;
      case '22P02':
        DatabaseErrorHandlers.handleInvalidDataType('campo', 'tipo esperado');
        break;
      default:
        DatabaseErrorHandlers.handleDatabaseError(error, context);
    }
  };
}
