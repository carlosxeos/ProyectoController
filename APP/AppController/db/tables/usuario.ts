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
  @Column('text', {nullable: true})
  public metadata: string;
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
    // lo ordenamos como asc porque queremos que el admin (el usuario de la sesion)
    // vaya arriba, porque solo los admin pueden ver la lista de usuarios
    return this.repository.find({
      order: {
        idTipoUsuario: 'ASC',
      },
    });
  }
  async addUsers(users: Usuario[]): Promise<Boolean> {
    try {
      // borramos todos los registros anteriores
      await this.repository.clear();
      await this.repository.save(users);
      return true;
    } catch (e) {
      console.error('error addUsers ', e);
      return false;
    }
  }

  getMetadataJson(usuario: Usuario): MetadataObject {
    return JSON.parse(usuario.metadata);
  }
}
