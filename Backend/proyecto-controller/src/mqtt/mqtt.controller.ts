/* eslint-disable prettier/prettier */
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';
import MqttDoorService from './door/mqtt.door.service';

@Controller()
export class MqttController {
  constructor(
    @Inject('MQ_CLIENT') client: ClientProxy,
    private readonly doorService: MqttDoorService,
  ) {
    MqttWSLinker.clientMQTT = client;
    console.log('cliente conectado');
    client.connect();
  }
  //%############################################
  // ############ A/C controller
  //%############################################
  @MessagePattern('set/ac_controller')
  getProcessClientData(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    MqttWSLinker.callLinker('get/ac_controller', data);
  }

  //%############################################
  // ############ DOOR
  //%############################################
  @MessagePattern('set/door')
  setDoor(@Payload() data, @Ctx() context: MqttContext) {
    this.doorService.openCloseDoor(data);
  }
}
