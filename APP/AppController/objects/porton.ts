/* eslint-disable prettier/prettier */
export class Porton {
  ultmodificacion!: string;
  idtipomodificacion!: number; // id para saber el ultimo tipo de modificacion que tiene
  descripcion!: string;
  uuid!: string;
  nombre!: string; // nombre de quien fue el ultimo en abrir el porton
  horario: string;
}
