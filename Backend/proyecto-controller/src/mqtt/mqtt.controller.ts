/* eslint-disable prettier/prettier */
import { Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';
import MqttDoorService from './door/mqtt.door.service';
import { isPrd, sendSMS } from 'src/utils/common';

@Controller()
export class MqttController {
  private readonly logger = new Logger(MqttController.name);
  constructor(
    @Inject('MQ_CLIENT') client: ClientProxy,
    private readonly doorService: MqttDoorService,
  ) {
    MqttWSLinker.clientMQTT = client;
    console.log('cliente conectado');
    if (isPrd) {
      console.warn('====================');
      console.warn('se encuentra en prd, manejelo con cuidado');
      console.warn('====================');
    }
    client.connect();
  }
  //%############################################
  // ############ A/C controller
  //%############################################
  @MessagePattern('set/ac_controller')
  getProcessClientData(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    //MqttWSLinker.callLinker('get/ac_controller', data);
  }

  // %############################################
  // ############ DOOR
  // %############################################
  @MessagePattern('set/door/+')
  setDoor(@Payload() data, @Ctx() context: MqttContext) {
    const splitFunc = context.getTopic().split('/');
    const uuid = splitFunc.length == 3 ? splitFunc[2] : '';
    console.log('uuid ', uuid);
    console.log('context ', context);
    // this.doorService.openCloseDoor(uuid, data['data']);
  }
  @MessagePattern('logs/doors')
  getLogDoor(@Payload() data, @Ctx() context: MqttContext) {
    this.logger.debug(`loog door msg: ${data}`);
    //console.log('context ', context);
  }

  @MessagePattern('logs/initsyst')
  async getInitSystem(@Payload() data: string) {
    this.logger.warn(`init Syst msg: Se inicia sistema ${data}`);
    //console.log('context ', context);
    if (data.includes('+sys-')) {
      const dataInArray = data.split('+sys-');
      const ssid = dataInArray[0] || 'N/A';
      const name = dataInArray[1] || 'N/A';
      if (isPrd) {
        sendSMS(`Se inicia sistema ${name} red ${ssid}`);
      } else {
        this.logger.debug(`Se inicia sistema ${name} red ${ssid}`);
      }
    }
  }
}
