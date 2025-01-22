/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';
import { validateTokenData } from 'src/utils/common';
@Controller('api')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  
  @Post('login')
  async loginUser(@Body() body: any): Promise<any> {
    return this.usuarioService.loginUser(body?.user, body?.password);
  }


  @Get('getusers')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() request) {
    const data = request.payloadData;
    validateTokenData(data);
    return this.usuarioService.getUsers(data.idUsuario, data.idEmpresa);
  }

  @Get('getTiposUsuarios')
  @UseGuards(JwtAuthGuard)
  async getTiposUsuarios(@Request() request) {
    const data = request.payloadData;    
    validateTokenData(data);
    return this.usuarioService.getTiposUsuarios();
  }
} //
