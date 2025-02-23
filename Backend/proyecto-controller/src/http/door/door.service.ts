/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConnectionPool, Request, VarChar, Numeric } from 'mssql';
import { MetaData } from 'src/objects/meta-data';
import { dataBaseConstants } from 'src/utils/common';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable({})
export class DoorService {
  private readonly logger = new Logger(DoorService.name);
  constructor(private usuarioService: UsuarioService) {}

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
    const usuarios = await this.usuarioService.getUserById(idUsuario);
    if (usuarios?.length == 0) {
      throw new HttpException('Usuario no registrado', HttpStatus.BAD_REQUEST, {
        cause: new Error('Usuario no registrado'),
      });
    }
    const usuario = usuarios[0];
    const metadata = new MetaData();
    const json = JSON.parse(usuario.metadata);
    metadata.porton = json?.porton || [];

    const data = await this.getPortonUuid(
      idUsuario,
      idTipoUsuario,
      metadata.porton.map((v) => v.uuid).join('&'),
    );
    // insertamos los horarios que se requieren
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      data[i].horario = metadata.porton.filter(
        (v) => v.uuid === element?.uuid,
      )[0].horario;
    }
    return data;
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
   * se obtienen todos los portones
   * @param idUsuario id del usuario
   * @param idTipoUsuario tipo de usuario
   * @returns array de portones
   */
  async getPorton(idUsuario: number, idTipoUsuario: number) {
    return this.getPortones(idUsuario, idTipoUsuario);
  }

  /**
   * obtiene todos los portones asignados a la empresa
   * @param idUsuario id del usuario que requiere los datos (debe ser de tipo administrador)
   * @returns [{uuid, descripcion}]
   */
  async getPortonesEmpresa(idUsuario: number) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      resultadoSP = await request.execute('sp_get_portones_empresa');
    } catch (error) {
      this.logger.error(error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];

  }
}
