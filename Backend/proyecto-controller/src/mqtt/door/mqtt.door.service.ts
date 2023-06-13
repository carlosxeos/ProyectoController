/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';

@Controller()
class MqttDoorService {
  openCloseDoor(data) {
    console.log('Client data in getProcessClientData for process', data);
    MqttWSLinker.callLinker('get/door', data);
  }
}

export default MqttDoorService;