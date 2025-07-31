/* eslint-disable prettier/prettier */
export class SetDoorPayload {
  uuid: string;
  token: string; // id para saber el ultimo tipo de modificacion que tiene
  type: number;
  lat: number;
  long: number; // nombre de quien fue el ultimo en abrir el porton
  mock: boolean;
}
