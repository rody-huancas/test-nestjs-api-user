import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from '@modules/users/users.module';
import { typeOrmConfig } from '@database/typeorm.config';
import { UseEnvironmentVariables } from '@config/env/env.enable';

@Module({
  imports: [
    // VARIABLES DE ENTORNO
    UseEnvironmentVariables,
    // TYPEORM
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfig, inject: [ConfigService] }),
    // LIMITAR PETICIONES
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    // MÓDULOS
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
