import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQ_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
          protocol: 'mqtt',
        },
      },
    ]),
  ],
  controllers: [MqttController],
})
export class MqttModule {}
