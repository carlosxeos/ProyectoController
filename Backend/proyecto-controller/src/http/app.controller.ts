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

  private validateTokenData(data: any) {
    if (!data?.idUsuario || !data?.idEmpresa || !data?.idTipoUsuario) {
      throw new HttpException('Token no encontrado', HttpStatus.BAD_REQUEST, {
        cause: new Error('Token no encontrado'),
      });
    }
  }
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
    this.validateTokenData(data);
    return this.appService.getPorton(data.idUsuario, data.idTipoUsuario);
  }

  @Get('getHistory')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() request, @Query('uuid') uuid: string) {
    const data = request.payloadData;
    this.validateTokenData(data);
    return this.appService.getHistory(data.idUsuario, uuid);
  }

  @Get('getusers')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() request) {
    const data = request.payloadData;
    this.validateTokenData(data);
    return this.appService.getUsers(data.idUsuario, data.idEmpresa);
  }

  @Get('getTiposUsuarios')
  @UseGuards(JwtAuthGuard)
  async getTiposUsuarios(@Request() request) {
    const data = request.payloadData;    
    this.validateTokenData(data);
    return this.appService.getTiposUsuarios();
  }
} //
