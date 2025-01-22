/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WSGateway } from './ws.gateway';
import { WSDoorService } from './door/ws.door.service';
import { JwtWSGuard } from 'guard/jwt-ws-guard';
import { JwtService } from '@nestjs/jwt';
import { DoorService } from 'src/http/door/door.service';
import { CatalogsService } from 'src/http/catalogs/catalogs.service';
import { UsuarioService } from 'src/http/usuario/usuario.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WSGateway,WSDoorService, JwtWSGuard, JwtService, UsuarioService, CatalogsService, DoorService],
})
export class WsModule {}
