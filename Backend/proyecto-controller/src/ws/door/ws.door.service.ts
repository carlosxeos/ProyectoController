/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/http/app.service';
import { dataBaseConstants } from 'src/utils/common';
import { ConnectionPool, VarChar, Numeric, Request } from 'mssql';
@Injectable({})
export class WSDoorService {
  // constructor(appService: AppService) {}

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
      console.error(error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }
}
