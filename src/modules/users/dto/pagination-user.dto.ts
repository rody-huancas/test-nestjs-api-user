import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

export class PaginationUserDto {
  @IsOptional()
  @IsPositive({ message: 'La página debe ser un número positivo' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsPositive({ message: 'El límite debe ser un número positivo' })
  @Max(100, { message: 'El límite máximo es 100' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Min(0, { message: 'La edad mínima debe ser 0 o mayor' })
  @Type(() => Number)
  minAge?: number;

  @IsOptional()
  @Min(0, { message: 'La edad máxima debe ser 0 o mayor' })
  @Type(() => Number)
  maxAge?: number;
}
