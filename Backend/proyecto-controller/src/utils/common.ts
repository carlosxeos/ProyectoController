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
    password: 'VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09',
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
      password: 'VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09',
    },
  },
];

export const jwtConstants = {
  secret: 'secretKey',
};

// localhost
export const dataBaseConstants = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'DotechProyectSystem',
  port: 1433,
  encrypt: false,
};

// prd
/*export const dataBaseConstants = {
  user: 'lucio',
  password: 'sosaGOD',
  server: '13.68.134.198',
  database: 'DotechProyectSystem',
  port: 1433,
  encrypt: false,
  options: {
    useUTC: true,
  },
};*/
export const sendSMSToClient = (
  message: string,
  phones: string[],
): Promise<boolean> => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'Basic bHVpcy5odWVydGFAZG90ZWNoLm14OjdGbVpGblNENzlUeA==',
  );
  const recipient = [];
  for (const ph of phones) {
    recipient.push({ msisdn: ph });
  }
  const raw = JSON.stringify({
    message: message,
    tpoa: 'Sender',
    recipient: recipient,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return fetch('https://api.labsmobile.com/json/send', requestOptions)
    .then(async (response) => {
      const respJson = await response?.json();
      console.log('response.text() ', respJson);
      return respJson?.code === '0';
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDateLocal(date: Date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}
