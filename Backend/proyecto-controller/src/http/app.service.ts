/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
import { MetaData } from 'src/objects/meta-data';
import { dataBaseConstants } from 'src/utils/common';
@Injectable({})
export class AppService {
  constructor(private jwtService: JwtService) {}
  /**
   * Obtiene un usuario por username
   * @param username usuario que se ingreso en la app
   */
  private async getUser(username: string): Promise<any[]> {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('P_usuario', VarChar(255), username);
      resultadoSP = await request.execute('sp_valid_user');
    } catch (error) {
      console.error('error getUser ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  public async getUserById(idUsuario: number, requireUserName = false) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('getUsr', Numeric(), requireUserName ? 1 : 0);
      resultadoSP = await request.execute('sp_get_user_id');
    } catch (error) {
      console.error('err getUserById ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  public async getPortonUuid(
    idUsuario: number,
    idTipoUsuario: number,
    list: string,
  ) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('idTipoUsuario', Numeric(), idTipoUsuario);
      request.input('uuidList', VarChar(), list);
      resultadoSP = await request.execute('sp_get_porton_uuid');
    } catch (error) {
      console.error(error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  private async getPortones(
    idUsuario: number,
    idTipoUsuario: number,
  ): Promise<any[]> {
    const usuarios = await this.getUserById(idUsuario);
    if (usuarios?.length == 0) {
      throw new HttpException('Usuario no registrado', HttpStatus.BAD_REQUEST, {
        cause: new Error('Usuario no registrado'),
      });
    }
    const usuario = usuarios[0];
    const metadata = new MetaData();
    const json = JSON.parse(usuario.metadata);
    metadata.porton = json?.porton || [];
    return await this.getPortonUuid(
      idUsuario,
      idTipoUsuario,
      metadata.porton.join('&'),
    );
  }

  async loginUser(user: string, password: string) {
    if (!(user && password)) {
      return { auth: false, error: 'Ingrese el usuario o la contraseña' };
    }
    const usuarios = await this.getUser(user);
    if (usuarios?.length == 0) {
      return {
        auth: false,
        error: 'No existe este usuario o se encuentra dado de baja',
      };
    }
    const usuario = usuarios[0];
    const contraseñaValida = await bcrypt.compare(
      password,
      usuario['password'],
    );
    if (contraseñaValida) {
      const payload = {
        idUsuario: usuario['idUsuario'],
        idTipoUsuario: usuario['idTipoUsuario'],
      };
      const jwt = this.jwtService.sign(payload);
      // se borra el password para evitar filtrar el password codificado
      delete usuario['password'];
      // se borra el id usuario y el idTipoUsuario porque esta informacion se encontrara en el paylaod del token con mas seguridad
      delete usuario['idUsuario'];
      delete usuario['idTipoUsuario'];
      // por ahora, como la unica accion disponible es el porton, si no tiene ningun permiso con el porton, borrara el uuid
      // para que no pueda acceder a ninguna de sus funciones
      if (!usuario['accionesPorton'] || usuario['accionesPorton'] == '0') {
        usuario['metadata'] = null;
      } else {
        if (usuario['metadata'].length > 2) {
          usuario['metadata'] = JSON.parse(usuario['metadata']);
        }
      }
      return { ...usuario, token: jwt, auth: true };
    }
    return { auth: false, error: 'Usuario o contraseña incorrectos' };
  }
  async getPorton(idUsuario: number, idTipoUsuario: number) {
    return this.getPortones(idUsuario, idTipoUsuario);
  }

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
      console.error('error getHistory ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

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
      console.error('err getDataSmsById ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }  
}
