/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WSGateway } from './ws.gateway';
import { WSDoorService } from './door/ws.door.service';
import { JwtWSGuard } from 'guard/jwt-ws-guard';
import { JwtService } from '@nestjs/jwt';
import { AppService } from 'src/http/app.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WSGateway,WSDoorService, JwtWSGuard, JwtService, AppService],
})
export class WsModule {}
