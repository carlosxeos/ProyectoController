/* eslint-disable prettier/prettier */
import {Entity, Column, PrimaryColumn, Repository} from 'typeorm';

import {AppDataSource} from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {keyStorage} from '../../Constants';
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
  @Column('text', {nullable: true})
  metadata!: string;
  // es una variable para el objeto transformado
  metadataObject: MetadataObject;
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
    console.log('data?.metadata ', data?.metadata);
    this.metadata = JSON.stringify(data?.metadata);
    return await this.guardar(this);
  }

  async getSession(): Promise<Session | null> {
    const sessiones = await this.repository.find();
    if (sessiones.length) {
      const session = sessiones[0];
      if (session.metadata.length > 0) {
        session.metadataObject = JSON.parse(session.metadata);
      }
      return session;
    }
    return null;
  }

  async removeSession(deleteUser: boolean = true) {
    await this.repository.createQueryBuilder().delete().from(Session).execute();
    if (deleteUser) {
      await AsyncStorage.removeItem(keyStorage.user);
    }
    console.warn('borrando sesion');
  }
}
