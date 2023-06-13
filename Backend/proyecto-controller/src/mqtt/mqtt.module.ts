/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { mqttClientRegistrer } from 'src/utils/common';
import { ClientsModule } from '@nestjs/microservices';
import MqttDoorService from './door/mqtt.door.service';

@Module({
  imports: [ClientsModule.register(mqttClientRegistrer)],
  controllers: [MqttController],
  providers: [MqttDoorService],
})
export class MqttModule {}
