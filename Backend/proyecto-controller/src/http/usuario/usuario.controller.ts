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
import { formatDateLocal, validateTokenData } from 'src/utils/common';
import { UsuarioData } from 'src/objects/usuario-data';
@Controller('api')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('sandbox')
  async sandBox() {
    console.log('sandbox ', formatDateLocal(new Date()));
    return { status: 'ok' };
  }
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

  @Post('valid_user')
  async validUser(@Body() body: any) {
    return this.usuarioService.validUser(body?.user);
  }

  @Post('add_newuser')
  @UseGuards(JwtAuthGuard)
  async addNewUser(@Request() request, @Body() body: UsuarioData) {
    const data = request.payloadData;
    console.log('body ', body);
    
    validateTokenData(data);
    return this.usuarioService.addNewUser(body, data.idUsuario, data.idEmpresa);
  }

  @Post('edit_user')
  @UseGuards(JwtAuthGuard)
  async editUser(@Request() request, @Body() body: UsuarioData) {
    const data = request.payloadData;
    validateTokenData(data);
    return this.usuarioService.editUser(body, data.idUsuario);
  }  

  @Post('delete_user')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() request, @Body() body: UsuarioData) {
    const data = request.payloadData;
    validateTokenData(data);
    return this.usuarioService.deleteUser(body?.idUsuario, data.idUsuario);
  }    
} //
