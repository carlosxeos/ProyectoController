/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { jwtConstants, mqttClientRegistrer } from 'src/utils/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

/**
 * Maneja todo lo relacionado a los usuarios(usuarios, tipos de usuario, login, agregar usuarios)
 */
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
