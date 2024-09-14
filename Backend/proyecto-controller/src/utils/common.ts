import fetch, { Headers } from 'node-fetch';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
/* eslint-disable prettier/prettier */
import {
  ClientsModuleOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export const isPrd = false;
// localhost
/*
export const dataBaseConstants = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'DotechProyectSystem',
  port: 1433,
  encrypt: false,
};*/
// prd
export const dataBaseConstants = {
  user: 'lucio',
  password: 'sosaGOD',
  server: '13.68.134.198',
  database: 'DotechProyectSystem',
  port: 1433,
  encrypt: false,
  options: {
    useUTC: true,
  },
};


/**
 * informacion de modo server de mqtt
 */

export const mqttConfig: MicroserviceOptions = {
  transport: Transport.MQTT,
  options: {
    url: 'mqtt://localhost:1883',
    protocol: 'mqtt',
    username: 'espsys',
    password: 'VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09',
  },
};

/**
 * informacion del modo cliente del server mqtt
 */
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

const sendSMSToClient = (
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
      console.error('labsmobile err ', error);
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

export const sendSMS = async (text: string): Promise<boolean> => {
  const dateString = new Date(
    new Date().toLocaleString('en', { timeZone: 'America/Mexico_City' }),
  );
  // TODO: por ahora solo se le va a enviar mensaje al numero de omar por cualquier tipo de alerta
  // cambiar a que se obtengan los contactos por bd
  return await sendSMSToClient(`${text} ${dateString}`, ['+528112558479']);
};

export const executeQuery = async <T>(
  query: string,
  logger: Logger = null,
): Promise<T[]> => {
  const conn = new ConnectionPool(dataBaseConstants);
  let resultadoSP = { recordset: [] };
  try {
    await conn.connect();
    const request = new Request(conn);
    resultadoSP = await request.query(query);
  } catch (error) {
    if (logger) {
      logger.error('error executeQuery ', error);
    }
    return null;
  } finally {
    conn.close();
  }
  return resultadoSP['recordset'];
};
