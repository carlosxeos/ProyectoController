/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WSGateway } from './ws.gateway';
import { WSDoorService } from './door/ws.door.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WSGateway,WSDoorService],
})
export class WsModule {}
