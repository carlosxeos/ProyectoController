/* eslint-disable prettier/prettier */
import { ClientProxy } from '@nestjs/microservices';
import { Server } from 'socket.io';
export class MqttWSLinker {
  static clientWS: Server;
  static clientMQTT: ClientProxy;
  private constructor() {
    console.log('constructor privado');
  }
  
  public static callMqtt(topic: string, message) {
    if (this.clientMQTT) {
      this.clientMQTT.emit(topic, message);
    } else {
      console.error('El cliente mqtt o ws no esta registrado');
    }
  }
}
