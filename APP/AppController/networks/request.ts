/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiURL, testingURL, tokenKey} from '../Constants';
import {History} from '../objects/history';
import {Porton} from '../objects/porton';
import TipoUsuario from '../db/tables/tipoUsuario';
/* eslint-disable prettier/prettier */
class Request {
  private apiUrl: string;
  constructor() {
    this.apiUrl = getApiURL();
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
        return new ErrorHandler(
          `Error ${await request.text()}`,
          request.status,
        );
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
  async loginUser(user: string, password: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const request = await this.fetchWithTimeout('login', {
        body: JSON.stringify({user: user, password: password}),
        method: 'POST',
        headers: myHeaders,
      });
      const result = await request.json();
      return result;
    } catch (e) {
      console.log('login error ', e);
      return {autenticado: false};
    }
  }

  async getPorton(token: string | undefined): Promise<Porton[]> {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token || ''}`);
      const request = await this.fetchWithTimeout('getPorton', {
        method: 'GET',
        headers: myHeaders,
      });
      const result = await request.json();
      return result;
    } catch (e) {
      console.log('getPorton error ', e);
      return [];
    }
  }

  async getHistory(uuid: string): Promise<History[]> {
    const token = await AsyncStorage.getItem(tokenKey);
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token || ''}`);
      const request = await this.fetchWithTimeout(`getHistory?uuid=${uuid}`, {
        method: 'GET',
        headers: myHeaders,
      });
      const result = await request.json();
      return result;
    } catch (e) {
      console.log('getPorton error ', e);
      return [];
    }
  }

  async getListUsers() {
    // TODO: agregar al metodo una funcion para enviar los ids de los usuarios que ya tenemos y su fecha de actualizacion
    return await this.requestGetMethod('getusers', true);
  }

  async getTiposUsuario() {
    return await this.requestGetMethod<TipoUsuario[]>('getTiposUsuarios', true);
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
