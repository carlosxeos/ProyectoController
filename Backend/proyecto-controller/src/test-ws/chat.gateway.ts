import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, {
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(socket: any) {
    // server
    console.log('Esto se ejecuta cuando inicia');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('iniciando conexion de un nuevo cliente');
  }

  handleDisconnect(client: any) {
    console.log('ALguien se fue!');
  }

  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, payload: string) {
    console.log('recibiriendo a ', payload);
    client.join(`room_${payload}`);
    this.server.to(`room_${payload}`).emit('new_message', 'temperatura en 20');
  }

  @SubscribeMessage('event_message') //TODO Backend
  handleIncommingMessage(
    client: Socket,
    payload: { room: string; message: string },
  ) {
    const { room, message } = payload;
    console.log(payload);
    this.server.to(`room_${room}`).emit('new_message', message);
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room: string) {
    console.log(`saliendo room_${room}`);
    client.leave(`room_${room}`);
  }
}
