/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { Session } from './tables/session';
import Usuario from './tables/usuario';
import TipoUsuario from './tables/tipoUsuario';

const AppDataSource = new DataSource({
    type: 'react-native',
    database: 'app-controller.sqlite',
    location: 'default',
    logging: ['error' /*'query'*/],
    synchronize: true,
    entities: [Session, Usuario, TipoUsuario],
  });

export {AppDataSource};
