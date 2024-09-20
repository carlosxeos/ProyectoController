/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MqttWSLinker } from 'src/utils/mqtt.ws.linker';

@Controller()
class MqttDoorService {
  openCloseDoor(uuid: string, data: { idUsuario: number; type: string }) {
    console.log('Client data in getProcessClientData for process', data);
    // MqttWSLinker.callWSRoom(uuid, 'updateDoor', { ...data, uuid: uuid });
  }
}

export default MqttDoorService;
