/* eslint-disable prettier/prettier */
export class UserAuthData {
  idUsuario: number;
  idTipoUsuario: number; // id para saber el ultimo tipo de modificacion que tiene
  metadata: string;
  userName: string;
  utc: string; // nombre de quien fue el ultimo en abrir el porton
  uuid: string;
  longitud: number;
  latitud: number;
}
