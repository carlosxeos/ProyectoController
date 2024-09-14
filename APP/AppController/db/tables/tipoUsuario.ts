/* eslint-disable prettier/prettier */
import {Column, Entity, PrimaryColumn, Repository} from 'typeorm';
import { AppDataSource } from '../database';
@Entity('ctTipoUsuario')
export default class TipoUsuario {
  @PrimaryColumn('int')
  public idTipoUsuario: number;
  @Column('text')
  public descripcion: string;
  @Column('int')
  public agregarUsuario: number;
  @Column('int')
  public accionesPorton: number;
  @Column('int')
  public accionesClima: number;
  private repository: Repository<TipoUsuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(TipoUsuario);
  }

  async getAll(): Promise<TipoUsuario[]> {
    return this.repository.find();
  }
  async addAll(tiposUsuarios: TipoUsuario[]) {
    await this.repository.save(tiposUsuarios);
  }
}
