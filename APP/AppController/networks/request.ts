/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiURL, testingURL, tokenKey} from '../Constants';
import {History} from '../objects/history';
import {Porton} from '../objects/porton';
import TipoUsuario from '../db/tables/tipoUsuario';
import {ResponsePost} from '../objects/response-post';
/* eslint-disable prettier/prettier */
class Request {
  private apiUrl: string;
  constructor() {
    this.apiUrl = getApiURL();
  }
  private async requestPostMethod<T>(
    url: string,
    needToken: boolean,
    body: {},
  ): Promise<ResponsePost<T>> {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      if (needToken) {
        const token = await AsyncStorage.getItem(tokenKey);
        myHeaders.append('Authorization', `Bearer ${token || ''}`);
      }
      const request = await this.fetchWithTimeout(url, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: myHeaders,
      });
      if (request.status === 401) {
        console.warn('token vencido');
        return new ResponsePost<T>(request.status, 'token vencido', false);
      }
      if (testingURL) {
        console.warn(`${url}: ${request.status}`);
      }
      if (!(request.status >= 200 && request.status < 300)) {
        return new ResponsePost(
          request.status,
          `${await request.json()}`,
          false,
        );
      }
      const result = new ResponsePost<T>(request.status, null, true);
      result.data = await request.json();
      return result;
    } catch (e) {
      console.log('requestPostMethod error ', e);
      return new ResponsePost(500, `error ${e}`, false);
    }
  }

  private async requestGetMethod<T = any>(
    url: string,
    needToken: boolean,
  ): Promise<ErrorHandler | T> {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      if (needToken) {
        const token = await AsyncStorage.getItem(tokenKey);
        myHeaders.append('Authorization', `Bearer ${token || ''}`);
      }
      const request = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: myHeaders,
      });
      if (request.status === 401) {
        console.warn('token vencido');
        return new ErrorHandler('token vencido', 401);
      }
      if (testingURL) {
        console.warn(`${url}: ${request.status}`);
      }
      if (!(request.status >= 200 && request.status < 300)) {
        return new ErrorHandler(`${await request.json()}`, request.status);
      }
      const result = await request.json();
      return result;
    } catch (e) {
      console.log('requestGetMethod error ', e);
      return new ErrorHandler(`error ${e}`, -1);
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000,
  ): Promise<Response> {
    return Promise.race([
      fetch(`${this.apiUrl}${url}`, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(null), timeout),
      ),
    ]);
  }

  /**
   * hace inicio de sesion del usuario
   * @param user usuario
   * @param password password
   * @param publicKey llave biometrica o uuid
   * @param isBiometric si es true, es a apartir de una llave biometrica
   * @returns logeo usuario
   */
  async loginUser(
    user: string,
    password: string,
    publicKey: string,
    isBiometric: boolean,
  ) {
    try {
      const result = await this.requestPostMethod<any>('login', false, {
        user: user,
        password: password,
        publicKey,
        isBiometric,
      });
      if (!result.sucess) {
        return {autenticado: false};
      }
      return result.data;
    } catch (e) {
      console.log('login error ', e);
      return {autenticado: false};
    }
  }

  async loginUserBiometric(user: string, signature: string, payload: string) {
    try {
      const result = await this.requestPostMethod<any>(
        'login_biometric',
        false,
        {
          user,
          signature,
          payload,
        },
      );
      if (!result.sucess) {
        return {autenticado: false};
      }
      return result.data;
    } catch (e) {
      console.log('loginUserBiometric error ', e);
      return {autenticado: false};
    }
  }
  async getPorton(): Promise<Porton[]> {
    try {
      const result = await this.requestGetMethod<Porton[]>(
        'door/getPorton',
        true,
      );
      if (result instanceof ErrorHandler) {
        console.log('getPorton error ', result?.error);
        return [];
      }
      return result;
    } catch (e) {
      console.log('getPorton error ', e);
      return [];
    }
  }

  async getHistory(uuid: string): Promise<History[]> {
    try {
      const result = await this.requestGetMethod<History[]>(
        `catalogs/getHistory?uuid=${uuid}`,
        true,
      );
      if (result instanceof ErrorHandler) {
        console.log('getHistory error ', result?.error);
        return [];
      }
      return result;
    } catch (e) {
      console.log('getPorton error ', e);
      return [];
    }
  }

  async getListUsers() {
    // TODO: agregar al metodo una funcion para enviar los ids de los usuarios que ya tenemos y su fecha de actualizacion
    return await this.requestGetMethod('users/getusers', true);
  }

  async getTiposUsuario() {
    return await this.requestGetMethod<TipoUsuario[]>(
      'users/getTiposUsuarios',
      true,
    );
  }

  async getPortonesEmpresa() {
    return await this.requestGetMethod<Porton[]>(
      'door/getPortonesEmpresa',
      true,
    );
  }

  /**
   * revisa si el username ya existe y esta en formato correcto
   * @param userName username
   * @returns valido
   */
  async checkUsername(userName: string): Promise<boolean> {
    try {
      const request = await this.requestPostMethod<any>(
        'users/valid_user',
        false,
        {
          user: userName,
        },
      );
      console.log('request ', request);

      return request.sucess && request.data?.valid;
    } catch (e) {
      console.log('checkUsername error ', e);
      return false;
    }
  }

  async addNewUser(
    userName: string,
    password: string,
    nombreCompleto: string,
    metadata: Horario[], //
  ): Promise<string> {
    try {
      const data = metadata.map(m => {
        return {
          horario: m.horario.join(','),
          uuid: m.uuid,
        };
      });
      const result = await this.requestPostMethod<any>(
        'users/add_newuser',
        true,
        {
          userName,
          password,
          nombreCompleto,
          metadata: data,
        },
      );
      if (result.sucess) {
        console.log('result print ', result);
        return null;
      }
      return result.error || result.data.error;
    } catch (e) {
      console.log('addNewUser error ', e);
      return 'Hubo un error en el request, intente de nuevo más tarde';
    }
  }

  async editUser(
    idUsuario: number,
    nombreCompleto: string,
    password: string,
    metadata: Horario[], //
  ): Promise<string> {
    try {
      const data = metadata.map(m => {
        return {
          horario: m.horario.join(','),
          uuid: m.uuid,
        };
      });
      const result = await this.requestPostMethod<any>(
        'users/edit_user',
        true,
        {
          idUsuario,
          nombreCompleto,
          password,
          metadata: data,
        },
      );
      if (result.sucess) {
        console.log('result print ', result);
        return null;
      }
      console.log('result edit ', result);
      return result.error || result.data.error;
    } catch (e) {
      console.log('addNewUser error ', e);
      return 'Hubo un error en el request, intente de nuevo más tarde';
    }
  }

  /**
   * Borra el usuario, pero solo borrado logico
   * Para borrar el usuario permanentemente seria desde la base de datos
   * @param idUsuario id del usuario a borrar
   * @returns usuario borrado
   */
  async deleteUser(idUsuario: number) {
    try {
      const result = await this.requestPostMethod<any>(
        'users/delete_user',
        true,
        {
          idUsuario,
        },
      );
      if (result.sucess) {
        return null;
      }
      return result.error || result.data.error;
    } catch (e) {
      return 'Hubo un error en el request, intente de nuevo más tarde';
    }
  }

  /**
   * cierra sesion para que pueda acceder otro dispositivo al instante
   * @returns
   */
  async logOut() {
    return true;
    //return await this.requestGetMethod('log_out', true);
  }
}

export class ErrorHandler {
  error: string;
  status: number;
  constructor(error: string, status: number) {
    this.error = error;
    this.status = status;
  }
}
export default Request;
