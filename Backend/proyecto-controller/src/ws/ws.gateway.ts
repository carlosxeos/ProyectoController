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
import { JwtWSGuard } from 'guard/jwt-ws-guard';
import { AppService } from 'src/http/app.service';
import { Logger } from '@nestjs/common';
@WebSocketGateway(81, {
  cors: { origin: '*' },
})
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{  
  private readonly logger = new Logger(WSGateway.name);
  constructor(
    private readonly doorService: WSDoorService,
    private guardWS: JwtWSGuard,
    private appService: AppService,
  ) {}
  @WebSocketServer() server: Server;
  private timeStamp = 0;
  afterInit(socket: any) {
    // server
    MqttWSLinker.clientWS = this.server;
    console.log('encendiendo server');
  }

  handleConnection(client: Socket, ...args: any[]) {
    //client.join('');
    console.log('args ', args);
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
    // MqttWSLinker.callLinker('get/ac_controller', payLoad);
  }

  //================================
  //====== Puertas
  //================================
  /**
   * suscribes el usuario a la puerta
   * @param client cliente
   * @param payLoad datos
   * @returns
   */
  @SubscribeMessage('join/door')
  async joinDoor(
    client: Socket,
    payLoad: {
      uuid: string;
      token: string;
      socketId: string;
    },
  ) {
    try {
      const response = await this.guardWS.checkToken(payLoad.token); // validas que el token sirva
      //client.join(`${payLoad.uuid}`);
      this.server.in(payLoad.socketId).socketsJoin(payLoad.uuid);
      // enviamos la informacion especificamente al usuario cuando recien se una al room
      const data = await this.appService.getPortonUuid(
        response.idUsuario,
        response.idTipoUsuario,
        payLoad.uuid,
      );
      if (data && data?.length > 0) {
        client.emit('roomDoor', data[0]);
      }
    } catch (e) {
      this.logger.error('joinDoor Err: ', e);
      return [];
    }
  }

  @SubscribeMessage('set/door')
  setDoorValue(client: Socket, payLoad: any) {
    if (this.timeStamp > Date.now()) {
      console.log('todavia no puedes mandar una señal');
      return;
    }
    console.log('payload ', payLoad);

    this.guardWS
      .checkToken(payLoad.token)
      .then(async (response) => {
        console.log(`set door `, response);
        this.timeStamp = Date.now() + 10000; // ponemos timestamp
        // vamos a llamar al mqtt para que el micro reciba la señal de abrir o cerrar
        MqttWSLinker.callMqtt(`get/door/${payLoad.uuid}`, {
          type: payLoad.type,
          idUsuario: response.idUsuario,
        });
        const data = await this.doorService.updateDoor(
          payLoad.uuid,
          response.idUsuario,
          payLoad.type,
        );
        console.log('data update door ', data);
        if (data && data?.length > 0) {
          this.server.to(payLoad.uuid).emit('roomDoor', data[0]);
        }
        // finalmente enviamos el sms
        const usuarios = await this.appService.getDataSmsById(response.idUsuario, payLoad.uuid);
        let username = '';
        let doorName = '';
        console.log('usuarios ', usuarios);
        if (usuarios?.length == 0) {
          username = 'user not found';
          doorName = 'D N/A';
        } else {
          const usuario = usuarios[0];
          username = usuario.userName;
          doorName = usuario.descripcion;
        }
        this.doorService.sendSMS(username, doorName);
      })
      .catch((e) => {
        console.log('set door err: ', e);
      });
  }

  /**
   * suscripcion de actualizacion de la puerta
   * @param payload payload
   * @returns   
  @SubscribeMessage('updateDoor')
  async handleRoomEvent(
    @MessageBody()
    payLoad: {
      uuid: string;
      token: string;
      type: string;
    },
  ): Promise<any> {
    console.log('recibiendo ', payLoad);
    this.guardWS.checkToken(payLoad.token).then(async (response) => {
      const data = await this.doorService.updateDoor(
        response.idUsuario,
        payLoad.type,
      );
      this.server.to(payLoad.uuid).emit('roomDoor', data && []);
    });
  } */
}
