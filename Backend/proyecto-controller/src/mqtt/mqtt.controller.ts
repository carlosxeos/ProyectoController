import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('math')
export class MqttController {
  @MessagePattern('notification_channel')
  getNotifications(@Payload() data) {
    console.log('Client data in getNotifications: ', data);
    return `Ha llegado un mensaje`;
  }
  @MessagePattern('process_channel')
  getProcessClientData(@Payload() data) {
    console.log('Client data in getProcessClientData for process', data);
    const result = data.split('');
    return result;
  }
}
