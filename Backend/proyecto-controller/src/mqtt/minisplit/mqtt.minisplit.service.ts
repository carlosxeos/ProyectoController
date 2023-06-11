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

@Controller('math')
export class MqttMinisplitService {
}
