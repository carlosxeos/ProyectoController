/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { AppService } from './app.service';
import { DoorModule } from './door/door.module';
import { jwtConstants, mqttClientRegistrer } from 'src/utils/common';
import { ClientsModule } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [],
  imports: [
    ClientsModule.register(mqttClientRegistrer),
    UsuarioModule, CatalogsModule, DoorModule
  ],  
  providers: [AppService],
})
export class AppModule {}
