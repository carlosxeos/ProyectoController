/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { match } from 'assert';
import * as bcrypt from 'bcrypt';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
import { dataBaseConstants } from 'src/utils/common';
@Injectable({})
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);
  private readonly userRegular = /((?=.{5,13}$)[a-z0-9]+\.[a-z0-9]+$)/;
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
   * inicia sesion
   * @param user usuario
   * @param password  password
   * @returns data del usuario
   */
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
   * obtiene todos los usuarios
   * @param idUsuario id del usuario(debe tener permiso de agregar usuarios)
   * @param idEmpresa id de la emrpesa
   * @returns usuarios array
   */
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

  /**
   * obtiene los tipo de usuario disponibles
   * @returns tipos de usuarios
   */
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

  async validUser(user: any) {
    if (!user) {
      throw new HttpException('Usuario incorrecto', HttpStatus.BAD_REQUEST, {
        cause: new Error('Usuario incorrecto'),
      });
    }
    if (!this.userRegular.test(user)) {
      throw new HttpException('Su username tiene un fomato no permitido', HttpStatus.BAD_REQUEST, {
        cause: new Error('Su username tiene un fomato no permitido'),
      });
    }
    const usuarios = await this.getUser(user);
    return { valid: usuarios?.length == 0 };
  }
}
