/* eslint-disable prettier/prettier */
import {
  ClientsModuleOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

export const mqttConfig: MicroserviceOptions = {
  transport: Transport.MQTT,
  options: {
    url: 'mqtt://localhost:1883',
    protocol: 'mqtt',
    username: 'espsys',
    password: "VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09"
  },
};

export const mqttClientRegistrer: ClientsModuleOptions = [
  {
    name: 'MQ_CLIENT',
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
      protocol: 'mqtt',
      username: 'espsys',
      password: "VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09"
    },
  },
];

export const jwtConstants = {
  secret: 'secretKey',
};

// prd
export const dataBaseConstants = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'DotechProyectSystem',
  port: 1433,
  encrypt: false,
};
