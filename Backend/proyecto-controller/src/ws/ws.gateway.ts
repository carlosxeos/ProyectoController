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
import { UsuarioService } from 'src/http/usuario/usuario.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { coldDownDoor } from 'src/utils/utils';
import { isPrd, sendSMS } from 'src/utils/common';
import { DoorService } from 'src/http/door/door.service';
import { CatalogsService } from 'src/http/catalogs/catalogs.service';
import { SetDoorPayload } from 'src/objects/ws/payloads/set-door-payload';
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
    private catalogService: CatalogsService,
    private doorServiceS: DoorService,
  ) {}

  @WebSocketServer() server: Server;
  private timeStampMap: Map<string, number> = new Map();
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
      const data = await this.doorServiceS.getPortonUuid(
        response.idUsuario,
        response.idTipoUsuario,
        payLoad.uuid,
      );
      if (data && data?.length > 0) {
        if (!this.timeStampMap.has(payLoad.uuid)) {
          // si no existe un registro previo, crea el map para tener el registro de timestamps por puertas
          this.logger.debug(`agregando porton ${payLoad.uuid}`);
          this.timeStampMap.set(payLoad.uuid, 0);
        }
        client.emit('roomDoor', data[0]);
      }
    } catch (e) {
      this.logger.error('joinDoor Err: ', e);
      if (e instanceof UnauthorizedException) {
        client.emit('errorTracker', { authFailed: true });
      } else {
        client.emit('errorTracker', { msg: e });
      }
    }
  }

  @SubscribeMessage('set/door')
  setDoorValue(client: Socket, payLoad: SetDoorPayload) {
    // console.log('payload ', payLoad);
    this.guardWS
      .checkToken(payLoad.token)
      .then(async (response) => {
        const isEnabled: number = await this.doorService.userIsAuthorized(
          response.idUsuario,
          payLoad.uuid,
          payLoad?.lat || 1998,
          payLoad?.long || 1998,
          payLoad?.mock
        );
        // si no esta autorizado en cuanto a horarios o permisos por latitud y longitud, envia un sms de alerta
        if (isEnabled !== 0) {
          const usuarios = await this.catalogService.getDataSmsById(
            response.idUsuario,
            payLoad.uuid,
          );
          const username = usuarios[0]?.userName || 'vacio';
          const doorName = usuarios[0]?.descripcion || 'n/a';
          const text: { sms: string; user: string } =
            this.doorService.getMessageUserAuthByError(
              username,
              doorName,
              isEnabled,
            );
          if (isPrd) {
            sendSMS(text.sms);
          } else {
            this.logger.error(text);
          }
          // enviamos una mensaje al usuario que realizo la accion que no tiene permiso en este horario
          this.server.to(payLoad.uuid).emit('unauthorizedDoor', {msg: text.user});
          return;
        }
        const tmpstmp = this.timeStampMap.get(payLoad.uuid);
        if (tmpstmp && tmpstmp > Date.now()) {
          this.logger.log(
            `porton ${payLoad.uuid} todavia no puede mandar una señal`,
          );
          return;
        }
        this.timeStampMap.set(payLoad.uuid, Date.now() + coldDownDoor); // ponemos timestamp
        this.logger.log(`set door `, response);
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
        // console.log('data update door ', data);
        if (data && data?.length > 0) {
          this.server.to(payLoad.uuid).emit('roomDoor', data[0]);
        }
        // finalmente enviamos el sms
        const usuarios = await this.catalogService.getDataSmsById(
          response.idUsuario,
          payLoad.uuid,
        );
        let username = '';
        let doorName = '';
        //console.log('usuarios ', usuarios);
        if (usuarios?.length == 0) {
          username = 'user not found';
          doorName = 'D N/A';
        } else {
          const usuario = usuarios[0];
          username = usuario.userName;
          doorName = usuario.descripcion;
        }
        const text = `${username} ha solicitado abrir/cerrar el porton ${doorName}`;
        if (isPrd) {
          sendSMS(text);
        } else {
          this.logger.warn(text);
        }
      })
      .catch((e) => {
        console.log('set door err: ', e);
        if (e instanceof UnauthorizedException) {
          client.emit('errorTracker', { authFailed: true });
        } else {
          client.emit('errorTracker', { msg: e });
        }
      });
  }
}
