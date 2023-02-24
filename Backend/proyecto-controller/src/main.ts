import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  //await app.listen(3000);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://192.168.0.10:1883',
    },
  });
  await app.listen();
}
bootstrap();
