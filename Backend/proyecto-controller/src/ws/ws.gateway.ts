/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';
import { WSDoorService } from './door/ws.door.service';

@WebSocketGateway(80, {
  cors: { origin: '*' },
})
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly doorService: WSDoorService) {}
  @WebSocketServer() server: Server;

  afterInit(socket: any) { // server
    MqttWSLinker.clientWS = this.server;
    console.log("encendiendo server")
  }

  handleConnection(client: any, ...args: any[]) { 
    console.log('nuevo cliente conectadp');
    
  }

  handleDisconnect(client: any) { 
    console.log('desconexion de cliente');
  }
  //================================
  //====== Climas
  //================================
  @SubscribeMessage('set/ac_controller')
  handleRoomLeave(client: Socket, payLoad: string) {
    console.log(`payLoad `, payLoad);
    // client.leave(`room_${room}`);    
    MqttWSLinker.callLinker('get/ac_controller',payLoad);
  }

  //================================
  //====== Puertas
  //================================
  @SubscribeMessage('testend/door')
  testDoor(client: Socket, payLoad: string) {
    this.doorService.testDoor();
  }

  @SubscribeMessage('set/door')
  setDoorValue(client: Socket, payLoad: string) {
    console.log(`set door `, payLoad);
    // client.leave(`room_${room}`);
    MqttWSLinker.callLinker('get/door', payLoad);
  }  
}
