/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DoorController } from './door.controller';
import { DoorService } from './door.service';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

/**
 * Maneja lo relacionado al porton(obtener portones, datos del porton)
 */
@Module({
  controllers: [DoorController],
  providers: [DoorService, UsuarioService, JwtAuthGuard, JwtService],
})
export class DoorModule {}
