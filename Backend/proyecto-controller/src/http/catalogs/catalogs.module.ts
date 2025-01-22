/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { JwtService } from '@nestjs/jwt';

/**
 * Obtiene lo relacionado a catalogo de datos(historial)
 */
@Module({
  controllers: [CatalogsController],
  providers: [CatalogsService, JwtService],
})
export class CatalogsModule {}
