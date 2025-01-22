/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DoorService } from './door.service';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';
import { validateTokenData } from 'src/utils/common';

@Controller('api/door')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}

  @Get('getPortonesEmpresa')
  @UseGuards(JwtAuthGuard)
  async getPortonesEmpresa(@Request() request) {
    const data = request.payloadData;    
    validateTokenData(data);
    return this.doorService.getPortonesEmpresa(data.idUsuario);
  }

  @Get('getPorton')
  @UseGuards(JwtAuthGuard)
  async getPorton(@Request() request) {
    const data = request.payloadData;
    validateTokenData(data);
    return this.doorService.getPorton(data.idUsuario, data.idTipoUsuario);
  }  
} //
