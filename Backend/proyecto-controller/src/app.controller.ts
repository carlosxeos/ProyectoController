import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';

@Controller('math')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }*/
  @MessagePattern('notification_channel')
  getNotifications(@Payload() data) {
    console.log('Client data in getNotifications: ', data);
    return `I Got Message From Client: ${data}`;
  }
}
