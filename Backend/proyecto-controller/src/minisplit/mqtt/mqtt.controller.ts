import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { TestLinker } from 'src/linkers/WsMqttLinker';

@Controller('math')
export class MqttController {
  constructor(@Inject('MQ_CLIENT') private client: ClientProxy) {
    client.connect();
    TestLinker.clientMQTT = client;
  }

  @MessagePattern('set/sensors/temperature')
  getProcessClientData(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    TestLinker.callLinker('get/sensors/temperature', data);
  }

  @MessagePattern('set/door')
  setDoor(@Payload() data, @Ctx() context: MqttContext) {
    console.log('Client data in getProcessClientData for process', data);
    TestLinker.callLinker('get/door', data);
  }
}
