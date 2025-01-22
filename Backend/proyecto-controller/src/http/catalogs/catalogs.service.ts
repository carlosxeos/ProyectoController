/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
import { dataBaseConstants } from 'src/utils/common';
@Injectable({})
export class CatalogsService {
  private readonly logger = new Logger(CatalogsService.name);
  constructor(
    private jwtService: JwtService,
  ) {}

  /**
   * Obtiene el historial del porton(en sql esta limitado a obtener los ultimos x registros,por ejemplo 50)
   * @param idUsuario id del usuario
   * @param uuid uuid del porton seleccionado
   * @returns historial
   */
  async getHistory(idUsuario: number, uuid: string) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('uuid', VarChar(), uuid);
      resultadoSP = await request.execute('sp_get_history');
    } catch (error) {
      this.logger.error('error getHistory ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  /**
   * 
   * @param idUsuario obtiene los datos de sms, en especifico, el nombre del porton
   * @param uuid id del porton
   * @returns data
   */
  public async getDataSmsById(idUsuario: number, uuid: string) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('uuid', VarChar(), uuid);
      resultadoSP = await request.execute('sp_get_data_sms');
    } catch (error) {
      this.logger.error('err getDataSmsById ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }
}
