/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
import { MetaData } from 'src/objects/meta-data';
import { dataBaseConstants } from 'src/utils/common';
@Injectable({})
export class AppService {
  private readonly logger = new Logger(AppService.name);
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
      this.logger.error('error getUser ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  /**
   * Obtiene los datos completos del usuario por su id de usuario
   * @param idUsuario id del usuario en bd
   * @param requireUserName si dentro de los parametros requiere que se obtenga su username
   * @returns idUsuario, idTipoUsuario, metadata, userName si requireUserName es true
   */
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
      this.logger.error('err getUserById ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  /**
   * Obtiene los datos de la tabla tbPorton por el uuid del porton
   * @param idUsuario id del usuario
   * @param idTipoUsuario id tipo usuario
   * @param list lista de uuid separados por &
   * @returns 
   */
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
      this.logger.error(error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  /**
   * Obtiene el dato de todos los portones que tiene disponible tu usuario
   * @param idUsuario id del usuario
   * @param idTipoUsuario tipo de usuario
   * @returns array de portones [{
   *   ultmodificacion!: string;
   *   idtipomodificacion!: number;
   *   descripcion!: string;
   *   uuid!: string;
   *   nombre!: string;
   *   horario: string;   
   *}]
   */
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
    console.log('metadata.porton ', metadata.porton);

    const data = await this.getPortonUuid(
      idUsuario,
      idTipoUsuario,
      metadata.porton.map((v) => v.uuid).join('&'),
    );
    // insertamos los horarios que se requieren
    for (const dato of data) {
      dato.horario = metadata.porton.filter(
        (v) => (v.uuid = dato?.uuid),
      )[0].horario;
    }
    return data;
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
        idEmpresa: usuario['idEmpresa'],
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

  /**
   * se obtienen todos los portones
   * @param idUsuario id del usuario
   * @param idTipoUsuario tipo de usuario
   * @returns array de portones
   */
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
      this.logger.error('error getHistory ', error);
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
      this.logger.error('err getDataSmsById ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  async getUsers(idUsuario: number, idEmpresa: number) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      request.input('idEmpresa', Numeric(), idEmpresa);
      resultadoSP = await request.execute('sp_get_users');
    } catch (error) {
      this.logger.error('error getUsers ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  async getTiposUsuarios() {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      resultadoSP = await request.query(
        'select idTipoUsuario, descripcion, agregarUsuario, accionesPorton, accionesClima from ctTipoUsuario',
      );
    } catch (error) {
      this.logger.error('error getUsers ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }
}
