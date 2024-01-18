/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('prueba')
  async getNivel(): Promise<string> {
    console.log('prueba');
    return 'HOLA';
  }

  @Post('login')
  async loginUser(@Body() body: any): Promise<any> {
    return this.appService.loginUser(body?.user, body?.password);
  }

  @Get('getPorton')
  @UseGuards(JwtAuthGuard)
  async getPorton(@Request() request) {
    const data = request.payloadData;
    if (!data.idUsuario || !data.idTipoUsuario) {
      throw new HttpException('Token no encontrado', HttpStatus.BAD_REQUEST, {
        cause: new Error('Token no encontrado'),
      });
    }
    return this.appService.getPorton(data.idUsuario, data.idTipoUsuario);
  }

  @Get('getHistory')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() request, @Query('uuid') uuid: string) {
    const data = request.payloadData;
    if (!data.idUsuario || !data.idTipoUsuario) {
      throw new HttpException('Token no encontrado', HttpStatus.BAD_REQUEST, {
        cause: new Error('Token no encontrado'),
      });
    }
    return this.appService.getHistory(data.idUsuario, uuid);
  }
}
