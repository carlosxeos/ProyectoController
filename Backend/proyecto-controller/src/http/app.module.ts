/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { AppService } from './app.service';
import { DoorModule } from './door/door.module';
import { mqttClientRegistrer } from 'src/utils/common';
import { ClientsModule } from '@nestjs/microservices';
import { LoginModule } from './login/login.module';

@Module({
  controllers: [],
  imports: [
    ClientsModule.register(mqttClientRegistrer),
    LoginModule, UsuarioModule, CatalogsModule, DoorModule
  ],  
  providers: [AppService],
})
export class AppModule {}
