/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TestLinker } from 'src/linkers/WsMqttLinker';

@WebSocketGateway(80, {
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(socket: any) { // server
    TestLinker.clientWS = this.server;
  }

  handleConnection(client: any, ...args: any[]) { 
    console.log('nuevo cliente conectadp');
    
  }

  handleDisconnect(client: any) { 
    console.log('desconexion de cliente');
  }

  @SubscribeMessage('set/sensors/temperature')
  handleRoomLeave(client: Socket, payLoad: string) {
    console.log(`payLoad `, payLoad);
    // client.leave(`room_${room}`);    
    TestLinker.callLinker('get/sensors/temperature',payLoad);
  }

  @SubscribeMessage('set/door')
  setDoorValue(client: Socket, payLoad: string) {
    console.log(`payLoad `, payLoad);
    // client.leave(`room_${room}`);    
    TestLinker.callLinker('get/door',payLoad);
  }
}
