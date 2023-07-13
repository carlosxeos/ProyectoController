/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MqttModule } from './mqtt/mqtt.module';
import { mqttConfig } from './utils/common';
import { AppModule } from './http/app.module';
import { WsModule } from './ws/ws.module';

async function bootstrap() {
  // configuracion para mqtt
  const mqtt = await NestFactory.createMicroservice<MicroserviceOptions>(
    MqttModule,
    mqttConfig,
  );
  await mqtt.listen();
  // https
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  // websocket
  const ws = await NestFactory.createMicroservice(WsModule);
  await ws.listen();
}
bootstrap();
