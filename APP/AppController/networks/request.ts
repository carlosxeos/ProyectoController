/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiURL, tokenKey} from '../Constants';
import { History } from '../objects/history';
import {Porton} from '../objects/porton';
/* eslint-disable prettier/prettier */
class Request {
  private apiUrl: string;
  constructor() {
    this.apiUrl = getApiURL();
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
}

export default Request;