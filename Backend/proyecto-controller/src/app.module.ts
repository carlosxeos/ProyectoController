import { Module } from '@nestjs/common';
import { MqttModule } from './minisplit/mqtt/mqtt.module';
import { ChatGateway } from './minisplit/websockets/chat.gateway';

@Module({
  imports: [MqttModule],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
