/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { dataBaseConstants, executeQuery } from 'src/utils/common';
import { ConnectionPool, VarChar, Numeric, Request } from 'mssql';
import { UsuarioService } from 'src/http/usuario/usuario.service';
import { MetaData } from 'src/objects/meta-data';
import * as moment from 'moment';
import { UserAuthData } from 'src/objects/ws/objects/user-auth-data';
import { getPreciseDistance } from 'geolib';
import { geoMetters } from 'src/utils/utils';
@Injectable({})
export class WSDoorService {
  constructor(private usuarioService: UsuarioService) {}

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

  /**
   * revisa si el usuario tiene permitido abrir el porton por temas de horarios o latitud y longitud
   * @param idUsuario
   * @param uuid
   * @param lat si es 1998 no viene incluida
   * @param long si es 1998 no viene incluida
   * @returns
   * 0 si esta autorizado
   * 1 si no obtiene datos en el query de la tabla ctUsuario
   * 2 si no tiene horarios para hoy
   * 3 si se encuentra a mas de la distancia declarada por geoMetters
   * 4 un error vario
   * 5 tiene la ubicacion simulada
   */
  async userIsAuthorized(
    idUsuario: number,
    uuid: string,
    lat: number,
    long: number,
    mock: boolean,
  ): Promise<number> {
    console.log('val ', mock);
    if (mock) { // TODO: en la siguiente version validar que no sea true
      return 5;
    }
    const usuarioData: UserAuthData[] = await executeQuery(
      `select usr.idUsuario, usr.idTipoUsuario, usr.metadata, usr.userName, porton.utc as utc, porton.uuid, porton.longitud, porton.latitud
      from ctUsuario usr inner join tbPorton porton on porton.uuid = '${uuid}' where usr.idUsuario = ${idUsuario}`,
      this.logger,
    );
    if (usuarioData === null || usuarioData.length == 0) {
      // si no hay usuario directamente esta mal
      return 1;
    }
    const utcTime: number = +usuarioData[0].utc;
    const momentDate = moment.utc().add(utcTime, 'hour');
    const metaData: MetaData = JSON.parse(usuarioData[0].metadata);
    for (const porton of metaData.porton) {
      if (porton.uuid === uuid) {
        const dayNumber = momentDate.day();
        const horariosToday: string[] = porton.horario
          .split(',')
          .filter((p) => +p[0] === dayNumber);
        if (horariosToday.length === 0) {
          // si no hay ningun horario directamente no tiene horarios hoy
          return 2;
        }
        // si no es de tipo remoto va a validar su ubicacion
        if (porton?.remote !== 'y') {
          if (lat == 1998 || long === 1998) {
            this.logger.error(
              `no se encuentra la latitud o longitud en el request`,
            );
            return 3;
          }
          const metters = getPreciseDistance(
            { latitude: lat, longitude: long },
            {
              latitude: usuarioData[0].latitud,
              longitude: usuarioData[0].longitud,
            },
            0.01,
          );
          if (metters > geoMetters) {
            this.logger.error(`esta a ${metters} del lugar, no puede abrir`);
            return 3;
          }
          this.logger.debug(`esta a ${metters} del lugar!!`);
        }
        for (const horario of horariosToday) {
          const cLetter = horario.indexOf('C');
          const abiertoMinutes = +horario.substring(2, cLetter);
          const cerradoMinutes = +horario.substring(cLetter + 1);
          if (abiertoMinutes === 0 && cerradoMinutes === 0) {
            // si es 0 en ambos significa que es horario de todo el dia
            return 0;
          }
          const mmtMidnight = momentDate.clone().startOf('day');
          const diffMinutes = momentDate.diff(mmtMidnight, 'minutes');
          if (diffMinutes >= abiertoMinutes && diffMinutes <= cerradoMinutes) {
            return 0;
          }
        }
        // si llega hasta aqui, es false porque aunque falten mas datos de metadata.porton, el uuid no puede duplicarse
        return 4;
      }
    }
    return 4;
  }

  /**
   * @param username
   * @param doorName
   * @param errorCode
   * 0 si esta autorizado
   * 1 si no obtiene datos en el query de la tabla ctUsuario
   * 2 si no tiene horarios para hoy
   * 3 si se encuentra a mas de la distancia declarada por geoMetters
   * 4 un error vario
   * 5 tiene la ubicacion simulada
   * @returns
   */
  getMessageUserAuthByError(
    username: string,
    doorName: string,
    errorCode: number,
  ): { sms: string; user: string } {
    if (errorCode === 3) {
      return {
        sms: `${username} ha intentado abrir porton ${doorName} lejos del lugar`,
        user: `Se encuentra muy lejos del porton, tiene que estar a una distancia menor a ${geoMetters} metros para abrir`,
      };
    }
    if (errorCode === 5) {
      return {
        sms: `${username} tiene ubicación simulada`,
        user: `Se encuentra muy lejos del porton, tiene que estar a una distancia menor a ${geoMetters} metros para abrir`,
      };
    }
    return {
      sms: `${username} intenta abrir/cerrar sin autorizacion en porton ${doorName}`,
      user: 'No es permitido abrir/cerrar el porton en este horario',
    };
  }
}
