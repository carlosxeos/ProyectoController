/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('prueba')
  async getNivel(): Promise<string> {
    console.log('prueba');    
    return "HOLA";
  }
}
