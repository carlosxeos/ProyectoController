/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectionPool, Request, Numeric, VarChar, MAX } from 'mssql';
import { dataBaseConstants, getUser } from 'src/utils/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TokenData } from 'src/objects/token-data';
@Injectable({})
export class LoginService {
  private readonly logger = new Logger(LoginService.name);
  constructor(private jwtService: JwtService) {}

  private async getUserBiometrics(username: string): Promise<any[]> {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('P_usuario', VarChar(255), username);
      resultadoSP = await request.execute('sp_valid_user_biometrics');
    } catch (error) {
      this.logger.error('error getUserBiometrics ', error);
    } finally {
      conn.close();
    }
    return resultadoSP['recordset'];
  }

  /**
   * Obtiene un usuario por username
   * @param username usuario que se ingreso en la app
   */
  private async registrerBiometricKey(
    idUsuario: number,
    keyBiometric: string,
    isBiometric: boolean,
  ): Promise<boolean> {
    const conn = new ConnectionPool(dataBaseConstants);
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('P_usuario_id', Numeric(), idUsuario);
      request.input('P_biometric', VarChar(MAX), keyBiometric);
      request.input('P_is_biometric', Numeric(), isBiometric ? 1 : 0);
      const resultadoSP = await request.execute('sp_registrer_biometric_key');
      return (
        resultadoSP.recordset.length > 0 &&
        resultadoSP.recordset[0]['registros'] > 0
      );
    } catch (error) {
      this.logger.error('error registrerBiometricKey ', error);
    } finally {
      conn.close();
    }
    return false;
  }

  /**
   * inicia sesion
   * @param user usuario
   * @param password  password
   * @param publicKey llave biometrica del dispositivo
   * @param isBiometric si es un dato biometrico valido
   * @returns data del usuario
   */
  async loginUser(
    user: string,
    password: string,
    publicKey: string,
    isBiometric: boolean,
  ) {
    if (!(user && password)) {
      return { auth: false, error: 'Ingrese el usuario o la contraseña' };
    }
    const usuarios = await getUser(this.logger, user, publicKey);
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
      const payload: TokenData = {
        idUsuario: usuario['idUsuario'],
        idTipoUsuario: usuario['idTipoUsuario'],
        idEmpresa: usuario['idEmpresa'],
      };
      if (
        !(await this.registrerBiometricKey(
          payload.idUsuario,
          publicKey,
          isBiometric,
        ))
      ) {
        this.logger.warn('No se pudo registrar los datos biometricos');
        return {
          auth: false,
          error: 'No se pudo registrar los datos biométricos',
        };
      }
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
   * inicia sesion
   * @param user usuario
   * @param signature llave biometrica del dispositivo
   * @param payloadSignature el payload que se uso para generar la firma
   * @returns data del usuario
   */
  async loginBiometric(
    user: string,
    signature: string,
    payloadSignature: string,
  ) {
    if (!user) {
      return { auth: false, error: 'Ingrese el usuario' };
    }
    const usuarios = await this.getUserBiometrics(user);
    if (usuarios?.length == 0) {
      return {
        auth: false,
        error:
          'El usuario es incorrecto o ya han iniciado sesión en otro dispositivo',
      };
    }
    const usuario = usuarios[0];
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${usuario['biometric_key']}\n-----END PUBLIC KEY-----`;
    let isValid = false;
    try {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(payloadSignature);
      verifier.end();
      isValid = verifier.verify(publicKey, signature, 'base64');
    } catch (e) {
      console.log('loginBiometric ', e);
      isValid = false;
    }
    if (!isValid) {
      return {
        auth: false,
        error:
          'No se pudo validar la firma, puede que se haya iniciado sesión con otro dispositivo',
      };
    }
    const payload = {
      idUsuario: usuario['idUsuario'],
      idTipoUsuario: usuario['idTipoUsuario'],
      idEmpresa: usuario['idEmpresa'],
    };
    if (
      !(await this.registrerBiometricKey(
        payload.idUsuario,
        usuario['biometric_key'],
        true,
      ))
    ) {
      this.logger.debug('No se pudo registrar los datos biometricos');
      return {
        auth: false,
        error: 'No se pudo registrar los datos biometricos',
      };
    }
    const jwt = this.jwtService.sign(payload);
    // se borra el id usuario y el idTipoUsuario porque esta informacion se encontrara en el paylaod del token con mas seguridad
    delete usuario['idUsuario'];
    delete usuario['idTipoUsuario'];
    // se quita la llave publica
    delete usuario['biometric_key'];
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

  async logOut(idUsuario: number) {
    const conn = new ConnectionPool(dataBaseConstants);
    let resultadoSP = { recordset: [] };
    try {
      await conn.connect();
      const request = new Request(conn);
      request.input('idUsuario', Numeric(), idUsuario);
      resultadoSP = await request.execute('sp_log_out');
    } catch (error) {
      this.logger.error('error logOut ', error);
      return { delete: false };
    } finally {
      conn.close();
    }
    if (resultadoSP.recordset.length <= 0) {
      return { delete: false };
    }
    return { delete: resultadoSP.recordset[0]?.deleted > 0};
  }
}
