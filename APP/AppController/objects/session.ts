/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Entity, Column, PrimaryColumn, getRepository, getConnection} from 'typeorm';

import {tokenKey} from '../Constants';
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
  async addSession(data: any) {
    this.id = 1;
    this.accionesClima = data.accionesClima;
    this.accionesPorton = data.accionesPorton;
    this.agregarUsuario = data.agregarUsuario;
    this.descripcion = data.descripcion;
    this.nombreCompleto = data.nombreCompleto;
    this.token = data.token;
    await AsyncStorage.setItem(tokenKey, data.token);
    return await this.guardar(this);
  }

  private async guardar(session: Session) {
    if (await this.getSession()) {
      // si existe ya un usuario, borra toda la info para insertarlo de nuevo
      await this.removeSession();
    }
    const repository = getRepository(Session);
    return await repository
      .createQueryBuilder('Session')
      .insert()
      .into(Session)
      .values(session)
      .execute();
  }

  async getSession(): Promise<Session | null> {
    const repo = getRepository(Session);
    const sessiones = await repo.find();
    if (sessiones.length) {
      const session = sessiones[0];
      return session;
    }
    return null;
  }

  async removeSession() {
    await getConnection().createQueryBuilder().delete().from(Session).execute();
  }
}
