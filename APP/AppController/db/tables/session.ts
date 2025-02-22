/* eslint-disable prettier/prettier */
import {Entity, Column, PrimaryColumn, Repository} from 'typeorm';

import {AppDataSource} from '../database';
@Entity('tbSession')
export class Session {
  @PrimaryColumn('int')
  id!: number;
  @Column('int')
  accionesClima!: number;
  @Column('int')
  accionesPorton!: number;
  @Column('int')
  agregarUsuario!: number;
  @Column('text', {nullable: true})
  descripcion!: string;
  @Column('text')
  nombreCompleto!: string;
  @Column('text', {nullable: true})
  token!: string;
  private repository: Repository<Session>;
  constructor() {
    this.repository = AppDataSource.getRepository(Session);
  }

  private async guardar(session: Session) {
    if (await this.getSession()) {
      // si existe ya un usuario, borra toda la info para insertarlo de nuevo
      await this.removeSession();
    }
    return await this.repository.save(session);
  }

  async addSession(data: any) {
    this.id = 1; // es 1 porque solo es para tener llave primaria
    this.accionesClima = +data.accionesClima;
    this.accionesPorton = +data.accionesPorton;
    this.agregarUsuario = +data.agregarUsuario;
    this.descripcion = data.descripcion;
    this.nombreCompleto = data.nombreCompleto;
    this.token = data.token;
    return await this.guardar(this);
  }

  async getSession(): Promise<Session | null> {
    const sessiones = await this.repository.find();
    if (sessiones.length) {
      const session = sessiones[0];
      return session;
    }
    return null;
  }

  async removeSession() {
    await this.repository.createQueryBuilder().delete().from(Session).execute();
  }
}
