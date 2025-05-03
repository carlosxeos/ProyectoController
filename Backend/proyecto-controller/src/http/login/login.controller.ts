/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { formatDateLocal } from 'src/utils/common';

@Controller('api')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('sandbox')
  async sandBox() {
    console.log('sandbox ', formatDateLocal(new Date()));
    return { status: 'ok' };
  }

  @Post('login')
  async loginUser(@Body() body: any): Promise<any> {
    return this.loginService.loginUser(
      body?.user,
      body?.password,
      body?.publicKey,
      body?.isBiometric,
    );
  }

  @Post('login_biometric')
  async loginBiometric(@Body() body: any): Promise<any> {
    return this.loginService.loginBiometric(body?.user, body?.signature, body?.payload);
  }
} //
