import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, IsDateString, IsPhoneNumber, IsEnum, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example    : 'Rody',
    description: 'Nombre del usuario',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({
    example    : 'Huancas',
    description: 'Apellido del usuario',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El apellido solo puede contener letras y espacios' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({
    example    : 'rody@correo.com',
    description: 'Email del usuario (debe ser único)',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    example    : 'MiPassword123',
    description: 'Contraseña (mínimo 8 caracteres, mayúscula, minúscula y número)',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' })
  password: string;

  @ApiProperty({
    example    : '+51987654321',
    description: 'Número de teléfono (opcional)',
    required   : false,
  })
  @IsOptional()
  @IsPhoneNumber('PE', { message: 'El teléfono debe ser válido para Perú' })
  phone?: string;

  @ApiProperty({
    example    : '1995-09-04',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD (opcional)',
    required   : false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  birthDate?: string;

  @ApiProperty({
    example    : 'user',
    description: 'Rol del usuario',
    enum       : ['user', 'admin', 'moderator'],
    default    : 'user',
    required   : false,
  })
  @IsOptional()
  @IsEnum(['user', 'admin', 'moderator'], { message: 'El rol debe ser: user, admin o moderator' })
  role?: string;
}
