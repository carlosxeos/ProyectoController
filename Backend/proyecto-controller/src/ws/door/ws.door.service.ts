/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { dataBaseConstants, sendSMSToClient } from 'src/utils/common';
import { ConnectionPool, VarChar, Numeric, Request } from 'mssql';
@Injectable({})
export class WSDoorService {
  // constructor(appService: AppService) {}
  private readonly logger = new Logger(WSDoorService.name);
  async updateDoor(uuid: string, idUsuario: number, estatus: number) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('estatus', Numeric(), estatus);
      request.input('uuid', VarChar(), uuid);
      resultadoSP = await request.execute('sp_update_door');
    } catch (error) {
      this.logger.error(error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  async sendSMS(username: string, doorName: string) {
    const dateString = new Date(new Date().toLocaleString('en', {timeZone: 'America/Mexico_City'}))
    // TODO: por ahora solo se le va a enviar mensaje al numero de omar por cualquier tipo de alerta
    // cambiar a que se obtengan los contactos por bd
    return await sendSMSToClient(`${username} ha solicitado abrir/cerrar el porton ${doorName}. ${dateString}`, ['+528112558479']);
  }
}
