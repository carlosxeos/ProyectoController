/* eslint-disable prettier/prettier */
import { Porton } from './porton';
export class UsuarioData {
  idUsuario: number;
  idTipoUsuario: number;
  userName: string;
  password: string;
  nombreCompleto: string;
  metadata: Porton[]; // se dejo en porton por ahora porque no se va a ocupar climas todavia
  idEmpresa: number;
}
