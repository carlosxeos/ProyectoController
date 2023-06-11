/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { mqttClientRegistrer } from 'src/utils/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register(mqttClientRegistrer)],
  controllers: [MqttController],
  providers: [],
})
export class MqttModule {}
