/* eslint-disable prettier/prettier */
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy, Ctx, MessagePattern, MqttContext, Payload,
} from '@nestjs/microservices';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';

@Controller()
export class MqttController {
  constructor(@Inject('MQ_CLIENT') client: ClientProxy) {
    MqttWSLinker.clientMQTT = client;
    console.log('cliente conectado');
    client.connect();
  }

  @MessagePattern('set/ac_controller')
  getProcessClientData(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    MqttWSLinker.callLinker('get/ac_controller', data);
  }

  @MessagePattern('set/door')
  setDoor(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    MqttWSLinker.callLinker('get/door', data);
  }  
}
