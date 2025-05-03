/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { JwtService } from '@nestjs/jwt';

/**
 * Maneja todo lo relacionado a los usuarios(usuarios, tipos de usuario, agregar usuarios)
 */
@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService],
})
export class UsuarioModule {}
