/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConnectionPool, Request, VarChar, Numeric, MAX } from 'mssql';
import { Porton } from 'src/objects/porton';
import { UsuarioData } from 'src/objects/usuario-data';
import { dataBaseConstants, getUser } from 'src/utils/common';
@Injectable({})
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);
  private readonly userRegular = /((?=.{5,13}$)[a-z0-9]+\.[a-z0-9]+$)/;
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
      throw new HttpException(
        'Su username tiene un fomato no permitido',
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error('Su username tiene un fomato no permitido'),
        },
      );
    }
    const usuarios = await getUser(this.logger, user);
    return { valid: usuarios?.length == 0 };
  }

  async addNewUser(usuario: UsuarioData, idAdmin: number, idEmpresa: number) {
    // antes de seguir revisamos si el username no existe por una validacion extra
    const exist = await this.validUser(usuario.userName);
    if (!exist.valid) {
      throw new HttpException(
        'Este username ya existe',
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error('Este username ya existe'),
        },
      );
    }
    usuario.idEmpresa = idEmpresa;
    usuario.idTipoUsuario = 2; // por ahora, los nuevos usuarios agregados seran de tipo 2 que es para visitantes sin permiso de admin
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('id_admin', Numeric(), idAdmin);
      request.input('id_empresa', Numeric(), usuario.idEmpresa);
      request.input('id_tipousuario', Numeric(), usuario.idTipoUsuario);

      const metadataTransformation = this.transformMetadata(usuario.metadata);
      request.input('metadata', VarChar(MAX), metadataTransformation);
      request.input('nombre_completo', VarChar(100), usuario.nombreCompleto);
      const passwordHash = await bcrypt.hash(usuario.password, 10);
      request.input('password', VarChar(MAX), passwordHash);
      request.input('user_name', VarChar(50), usuario.userName);
      resultadoSP = await request.execute('sp_add_user');
    } catch (error) {
      this.logger.error('error addNewUser ', error);
      throw new HttpException(
        'Hubo un error al enviar la información revise con el administrador',
        HttpStatus.NOT_FOUND,
        {
          cause: new Error(
            'Hubo un error al enviar la información revise con el administrador',
          ),
        },
      );
    } finally {
      conn.close();
    }
    const record = resultadoSP['recordset'];
    if (record.length != 0) {
      return { save: true, id: record[0]?.idUsuario };
    }
    throw new HttpException(
      'No se pudo guardar el usuario',
      HttpStatus.NOT_FOUND,
      {
        cause: new Error('No se pudo guardar el usuario'),
      },
    );
  }

  async editUser(usuario: UsuarioData, idAdmin: number) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('id_admin', Numeric(), idAdmin);
      const metadataTransformation = this.transformMetadata(usuario.metadata);
      request.input('metadata', VarChar(MAX), metadataTransformation);
      request.input('nombre_completo', VarChar(100), usuario.nombreCompleto);
      request.input('id_usuario', Numeric(), usuario.idUsuario);
      if (usuario.password) {
        const passwordHash = await bcrypt.hash(usuario.password, 10);
        request.input('password', VarChar(), passwordHash);
      }
      resultadoSP = await request.execute('sp_edit_user');
    } catch (error) {
      this.logger.error('error editUser ', error);
      throw new HttpException(
        'Hubo un error al enviar la información revise con el administrador',
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error(
            'Hubo un error al enviar la información revise con el administrador',
          ),
        },
      );
    } finally {
      conn.close();
    }
    const record = resultadoSP['recordset'];
    if (record.length != 0) {
      return { save: true };
    }
    throw new HttpException(
      'No se pudo encontrar el usuario',
      HttpStatus.NOT_FOUND,
      {
        cause: new Error('No se pudo encontrar el usuario'),
      },
    );
  }

  async deleteUser(idUsuario: number, idAdmin: any) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('id_admin', Numeric(), idAdmin);
      request.input('id_usuario', Numeric(), idUsuario);
      resultadoSP = await request.execute('sp_delete_user');
    } catch (error) {
      this.logger.error('error deleteUser ', error);
      throw new HttpException(
        'Hubo un error al enviar la información revise con el administrador',
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error(
            'Hubo un error al enviar la información revise con el administrador',
          ),
        },
      );
    } finally {
      conn.close();
    }
    const record = resultadoSP['recordset'];
    if (record.length != 0) {
      return { save: true };
    }
    throw new HttpException(
      'No se pudo encontrar el usuario',
      HttpStatus.NOT_FOUND,
      {
        cause: new Error('No se pudo encontrar el usuario'),
      },
    );
  }

  transformMetadata(metadata: Porton[]): string {
    return JSON.stringify({
      porton: metadata,
    });
  }
}
