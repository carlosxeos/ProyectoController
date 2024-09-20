/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Repository,
} from 'typeorm';
import {AppDataSource} from '../database';
import TipoUsuario from './tipoUsuario';
@Entity('ctUsuario')
export default class Usuario {
  @PrimaryColumn('int')
  public idUsuario: number;
  @Column('text')
  public nombreCompleto: string;
  @Column('int')
  public idEmpresa: number;
  @ManyToOne(() => TipoUsuario, type => type.idTipoUsuario, {
    eager: true,
  })
  @JoinColumn()
  public idTipoUsuario: TipoUsuario;
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }
  async getUsers(): Promise<Usuario[]> {
    return this.repository.find();
  }
  async addUsers(users: Usuario[]): Promise<Boolean> {
    try {
      this.repository.save(users);
      return true;
    } catch (e) {
      console.error('error addUsers ', e);
      return false;
    }
  }
}
