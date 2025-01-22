/* eslint-disable prettier/prettier */
import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';
import { validateTokenData } from 'src/utils/common';

@Controller('api/catalogs')
export class CatalogsController {
  constructor(private readonly catalogService: CatalogsService) {}
  @Get('getHistory')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() request, @Query('uuid') uuid: string) {
    const data = request.payloadData;
    validateTokenData(data);
    return this.catalogService.getHistory(data.idUsuario, uuid);
  }
} //
