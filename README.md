# API REST de Gestión de Usuarios

API REST profesional desarrollada con NestJS que implementa un sistema completo de gestión de usuarios con enfoque en seguridad, arquitectura limpia y buenas prácticas de desarrollo.

## Descripción

Sistema backend robusto para la gestión de usuarios que incluye operaciones CRUD completas, validación de datos, paginación, filtros y capas de seguridad siguiendo las recomendaciones de OWASP. El proyecto está diseñado con arquitectura modular, separación de responsabilidades y código mantenible.

## Tecnologías Utilizadas

### Core
- **Node.js** v22.10.7 - Runtime de JavaScript
- **NestJS** v11.0.1 - Framework progresivo de Node.js
- **TypeScript** v5.7.3 - Superset tipado de JavaScript
- **TypeORM** v0.3.27 - ORM para TypeScript y JavaScript

### Base de Datos
- **PostgreSQL** v14.4 - Sistema de gestión de base de datos relacional
- **Docker** - Contenedorización de PostgreSQL

### Seguridad
- **Helmet** v8.1.0 - Protección de headers HTTP
- **bcrypt** v6.0.0 - Hash de contraseñas
- **class-validator** v0.14.2 - Validación de DTOs
- **class-transformer** v0.5.1 - Transformación y sanitización de datos
- **@nestjs/throttler** v6.4.0 - Rate limiting

### Documentación
- **Swagger/OpenAPI** v11.2.0 - Documentación interactiva de API

### Gestión de Paquetes
- **pnpm** - Gestor de paquetes eficiente

## Características Principales

### Funcionalidades
- **CRUD Completo de Usuarios**: Crear, leer, actualizar y eliminar usuarios
- **Paginación Avanzada**: Sistema de paginación configurable con límites
- **Filtros por Edad**: Búsqueda de usuarios por rango de edad (minAge, maxAge)
- **Soft Delete**: Desactivación lógica de usuarios sin eliminación física
- **Validación Robusta**: Validación exhaustiva de todos los inputs
- **Cálculo Automático de Edad**: Basado en fecha de nacimiento
- **Gestión de Roles**: Sistema de roles (user, admin, moderator)
- **Hash Automático de Contraseñas**: Encriptación transparente con bcrypt

### Arquitectura
- **Arquitectura Modular**: Separación clara de responsabilidades
- **DTOs Tipados**: Validación y transformación de datos
- **Entidades TypeORM**: Mapeo objeto-relacional
- **Pipes Personalizados**: Validación de UUIDs
- **Filtros de Excepción**: Manejo centralizado de errores
- **Configuración Centralizada**: Variables de entorno gestionadas

## Prácticas de Seguridad OWASP Implementadas

### 1. Validación y Sanitización de Inputs (A03:2021 - Injection)
**Implementación**: Uso de `class-validator` y `class-transformer` en todos los DTOs.

**Detalles**:
- Validación de tipos de datos (string, email, phone, date)
- Límites de longitud en campos de texto
- Expresiones regulares para nombres (solo letras y espacios)
- Validación de formato de email
- Transformación automática (trim, toLowerCase)
- Whitelist habilitado para rechazar propiedades no definidas

**Archivos**: `create-user.dto.ts`, `update-user.dto.ts`, `pagination-user.dto.ts`

### 2. Prevención de Inyección SQL (A03:2021 - Injection)
**Implementación**: TypeORM con consultas parametrizadas.

**Detalles**:
- Uso exclusivo de QueryBuilder y métodos ORM
- Sin concatenación de strings en consultas
- Parámetros automáticamente escapados por TypeORM
- Validación de UUIDs antes de consultas

**Archivos**: `users.service.ts`, `user.entity.ts`

### 3. Hash Seguro de Contraseñas (A02:2021 - Cryptographic Failures)
**Implementación**: bcrypt con salt rounds configurables.

**Detalles**:
- Hash automático en hooks `@BeforeInsert` y `@BeforeUpdate`
- Contraseñas nunca almacenadas en texto plano
- Validación de complejidad de contraseña (mayúsculas, minúsculas, números)
- Mínimo 8 caracteres requeridos

**Archivos**: `user.entity.ts`, `bcrypt.ts`

### 4. Rate Limiting (A04:2021 - Insecure Design)
**Implementación**: `@nestjs/throttler` con límites globales y específicos.

**Detalles**:
- Límite global: 10 peticiones por minuto
- Límite para creación de usuarios: 3 peticiones por minuto
- Prevención de ataques de fuerza bruta
- Respuestas HTTP 429 (Too Many Requests)

**Archivos**: `app.module.ts`, `users.controller.ts`, `throttler-exception.filter.ts`

### 5. Headers de Seguridad HTTP (A05:2021 - Security Misconfiguration)
**Implementación**: Helmet para configuración de headers seguros.

**Detalles**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` para HTTPS
- Prevención de clickjacking y XSS

**Archivos**: `security.config.ts`

### 6. CORS Configurado (A05:2021 - Security Misconfiguration)
**Implementación**: CORS restrictivo con orígenes permitidos.

**Detalles**:
- Lista blanca de orígenes configurables
- Métodos HTTP específicos permitidos
- Credenciales habilitadas solo para orígenes confiables
- Configuración mediante variables de entorno

**Archivos**: `security.config.ts`, `main.ts`

### 7. Validación de UUIDs (A01:2021 - Broken Access Control)
**Implementación**: Pipe personalizado para validar UUIDs.

**Detalles**:
- Validación de formato UUID v4
- Prevención de inyección de parámetros maliciosos
- Respuestas HTTP 400 para UUIDs inválidos

**Archivos**: `uuid-validation.pipe.ts`

### 8. Manejo Centralizado de Errores
**Implementación**: Filtros de excepción personalizados.

**Detalles**:
- No exposición de stack traces en producción
- Mensajes de error genéricos para el cliente
- Logging detallado para debugging
- Códigos de estado HTTP apropiados

**Archivos**: `throttler-exception.filter.ts`

## Estructura del Proyecto

```
test-api-users/
├── src/
│   ├── config/                    # Configuraciones globales
│   │   ├── env/                   # Variables de entorno
│   │   ├── security/              # Configuración de seguridad (Helmet, CORS)
│   │   ├── swagger/               # Configuración de documentación
│   │   └── validation/            # Configuración de validación global
│   ├── database/                  # Configuración de TypeORM
│   ├── modules/                   # Módulos de la aplicación
│   │   └── users/                 # Módulo de usuarios
│   │       ├── dto/               # Data Transfer Objects
│   │       ├── entities/          # Entidades de TypeORM
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── shared/                    # Recursos compartidos
│   │   ├── filters/               # Filtros de excepción
│   │   ├── lib/                   # Librerías (bcrypt)
│   │   ├── pipes/                 # Pipes personalizados
│   │   └── utils/                 # Utilidades
│   ├── app.module.ts              # Módulo raíz
│   └── main.ts                    # Punto de entrada
├── docker-compose.yml             # Configuración de PostgreSQL
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración de TypeScript
└── README.md                      # Documentación
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Aplicación
NODE_ENV=development
APP_PORT=3000
PUBLIC_URL=http://localhost:3000

# CORS - Orígenes permitidos (separados por comas)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Base de Datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=db_apiusers
```

## Instalación

### Prerrequisitos
- Node.js v22.10.7 o superior
- pnpm (instalable con `npm install -g pnpm`)
- Docker y Docker Compose (para PostgreSQL)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/rody-huancas/test-nestjs-api-user
cd test-nestjs-api-user
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env basado en el ejemplo anterior
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar base de datos PostgreSQL con Docker**
```bash
docker-compose up -d
```

5. **Verificar que PostgreSQL esté corriendo**
```bash
docker ps
# Deberías ver el contenedor db_apiusers
```

## Ejecución del Proyecto

### Modo Desarrollo
```bash
pnpm run start:dev
```
El servidor se iniciará en `http://localhost:3000` con hot-reload habilitado.

### Modo Producción
```bash
# Compilar el proyecto
pnpm run build

# Ejecutar en producción
pnpm run start:prod
```

### Verificar que el servidor está corriendo
Al iniciar, deberías ver en consola:
```
[Bootstrap] [SECURITY] CORS habilitado para: http://localhost:3000
[Bootstrap] [SECURITY] Rate limiting: 10 req/min global, 3 req/min para crear usuarios
[Bootstrap] [INFO] Servidor iniciado en 'http://localhost:3000'
[Bootstrap] [INFO] Documentación en 'http://localhost:3000/api/docs'
```

## Endpoints Disponibles

Todos los endpoints tienen el prefijo `/api/v1`.

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/users` | Crear un nuevo usuario |
| GET | `/api/v1/users` | Listar usuarios con paginación y filtros |
| GET | `/api/v1/users/:id` | Obtener un usuario por ID (UUID) |
| PATCH | `/api/v1/users/:id` | Actualizar un usuario |
| DELETE | `/api/v1/users/:id` | Desactivar un usuario (soft delete) |

## Ejemplos de Uso

### 1. Crear un Usuario

**Request**:
```bash
POST http://localhost:3000/api/v1/users
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "Password123",
  "phone": "+51987654321",
  "birthDate": "1990-05-15",
  "role": "user"
}
```

**Response** (201 Created):
```json
{
  "idUser": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+51987654321",
  "birthDate": "1990-05-15",
  "age": 34,
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-05T16:47:40.000Z",
  "updatedAt": "2025-10-05T16:47:40.000Z"
}
```

**Validaciones**:
- `firstName` y `lastName`: Solo letras y espacios, máximo 100 caracteres
- `email`: Formato válido, único en la base de datos
- `password`: Mínimo 8 caracteres, debe contener mayúscula, minúscula y número
- `phone`: Formato válido para Perú (opcional)
- `birthDate`: Formato ISO 8601 (YYYY-MM-DD) (opcional)
- `role`: Debe ser "user", "admin" o "moderator" (opcional, default: "user")

### 2. Listar Usuarios con Filtros y Paginación

**Request**:
```bash
GET http://localhost:3000/api/v1/users?page=1&limit=10&minAge=25&maxAge=40
```

**Parámetros de Query**:
- `page`: Número de página (default: 1)
- `limit`: Usuarios por página (default: 10, máximo: 100)
- `minAge`: Edad mínima (opcional)
- `maxAge`: Edad máxima (opcional)

**Response** (200 OK):
```json
{
  "data": [
    {
      "idUser": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Juan",
      "lastName": "Pérez",
      "fullName": "Juan Pérez",
      "email": "juan.perez@example.com",
      "age": 34,
      "role": "user",
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Obtener Usuario por ID

**Request**:
```bash
GET http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "idUser": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+51987654321",
  "birthDate": "1990-05-15",
  "age": 34,
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-05T16:47:40.000Z",
  "updatedAt": "2025-10-05T16:47:40.000Z"
}
```

### 4. Actualizar Usuario

**Request**:
```bash
PATCH http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "phone": "+51912345678"
}
```

**Response** (200 OK):
```json
{
  "idUser": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Juan Carlos",
  "lastName": "Pérez",
  "fullName": "Juan Carlos Pérez",
  "email": "juan.perez@example.com",
  "phone": "+51912345678",
  "age": 34,
  "role": "user",
  "isActive": true,
  "updatedAt": "2025-10-05T17:00:00.000Z"
}
```

### 5. Desactivar Usuario

**Request**:
```bash
DELETE http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "message": "Usuario desactivado exitosamente",
  "idUser": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Documentación Swagger

La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api/docs
```

### Características de Swagger
- Interfaz interactiva para probar todos los endpoints
- Esquemas de request/response detallados
- Validaciones y restricciones documentadas
- Códigos de estado HTTP explicados
- Ejemplos de uso incluidos

### Cómo usar Swagger
1. Iniciar el servidor en modo desarrollo
2. Abrir navegador en `http://localhost:3000/api/docs`
3. Explorar los endpoints disponibles
4. Hacer clic en "Try it out" para probar endpoints
5. Completar los parámetros requeridos
6. Ejecutar y ver la respuesta en tiempo real

## Decisiones Técnicas Importantes

### 1. Arquitectura Modular con NestJS
**Razón**: Facilita el escalamiento y mantenimiento. Permite separación clara de responsabilidades y reutilización de código.

### 2. TypeORM como ORM
**Razón**: Proporciona abstracción de base de datos, migraciones automáticas y prevención de inyección SQL mediante consultas parametrizadas.

### 3. DTOs con class-validator
**Razón**: Validación declarativa y tipado fuerte. Reduce código boilerplate y centraliza la lógica de validación.

### 4. Soft Delete en lugar de Delete Físico
**Razón**: Permite recuperación de datos, auditoría y cumplimiento de normativas de retención de datos.

### 5. Hash Automático en Entity Hooks
**Razón**: Garantiza que las contraseñas nunca se almacenen en texto plano, incluso si se olvida hashear manualmente.

### 6. UUIDs como Primary Keys
**Razón**: Mayor seguridad (no predecibles), compatibilidad con sistemas distribuidos, y prevención de enumeración de recursos.

### 7. Paginación Obligatoria
**Razón**: Previene sobrecarga del servidor y mejora el rendimiento en datasets grandes.

### 8. Rate Limiting Diferenciado
**Razón**: Protección contra ataques de fuerza bruta y abuso de API, con límites más estrictos en operaciones sensibles.

### 9. Configuración Centralizada
**Razón**: Facilita el despliegue en diferentes entornos (dev, staging, prod) sin cambios en el código.

### 10. Separación de Concerns
**Razón**: Controllers manejan HTTP, Services contienen lógica de negocio, Entities representan datos. Facilita testing y mantenimiento.

### 11. Transformación Automática de Datos
**Razón**: Normalización consistente (trim, toLowerCase) previene duplicados y mejora la calidad de datos.

### 12. Validación de Complejidad de Contraseñas
**Razón**: Cumplimiento de estándares de seguridad y protección contra contraseñas débiles.

---

**Desarrollado con NestJS, TypeScript y buenas prácticas de desarrollo backend.**
