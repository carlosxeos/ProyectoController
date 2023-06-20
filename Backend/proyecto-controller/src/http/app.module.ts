/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mqttClientRegistrer } from 'src/utils/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register(mqttClientRegistrer)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
