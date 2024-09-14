/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { dataBaseConstants, executeQuery } from 'src/utils/common';
import { ConnectionPool, VarChar, Numeric, Request } from 'mssql';
import { AppService } from 'src/http/app.service';
import { MetaData } from 'src/objects/meta-data';
import * as moment from 'moment';
@Injectable({})
export class WSDoorService {
  constructor(private appService: AppService) {}

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
  async userIsAuthorized(idUsuario: number, uuid: string): Promise<boolean> {
    const usuarioData = await <any>executeQuery(`select usr.idUsuario, usr.idTipoUsuario, usr.metadata, usr.userName, (select utc from tbPorton where uuid = '${uuid}') as utc from ctUsuario usr where usr.idUsuario = ${idUsuario}`, this.logger);
    if (usuarioData === null || usuarioData.length == 0) {
      // si no hay usuario directamente esta mal
      console.log('no encontramos datos');
      
      return false;
    }
    const utcTime : number = +usuarioData[0].utc;
    const momentDate = moment.utc().add(utcTime, 'hour');
    const metaData: MetaData = JSON.parse(usuarioData[0].metadata);    
    for (const porton of metaData.porton) {
      if (porton.uuid === uuid) {
        const dayNumber = momentDate.day();
        console.log('dayNumber ', dayNumber);
        
        const horariosToday: string[] = porton.horario
          .split(',')
          .filter((p) => +p[0] === dayNumber);
        if (horariosToday.length === 0) {
          // si no hay ningun horario directamente no tiene horarios hoy
          return false;
        }
        for (const horario of horariosToday) {
          const cLetter = horario.indexOf('C');
          const abiertoMinutes = +horario.substring(2, cLetter);
          const cerradoMinutes = +horario.substring(cLetter + 1);
          console.log('hora actual server ', momentDate);          
          if(abiertoMinutes === 0 && cerradoMinutes === 0) { // si es 0 en ambos significa que es horario de todo el dia
            return true;
          }          
          const mmtMidnight = momentDate.clone().startOf('day');
          const diffMinutes = momentDate.diff(mmtMidnight, 'minutes');
          console.log('diffMinutes ', diffMinutes);
          
          if (diffMinutes >= abiertoMinutes && diffMinutes <= cerradoMinutes) {
            return true;
          }
        }
        // si llega hasta aqui, es false porque aunque falten mas datos de metadata.porton, el uuid no puede duplicarse
        return false;
      }
    }
    return false;
  }
}
