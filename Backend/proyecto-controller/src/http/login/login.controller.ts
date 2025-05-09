/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { formatDateLocal, validateTokenData } from 'src/utils/common';
import { JwtAuthGuard } from 'guard/jwt-auth-guard';
import { TokenData } from 'src/objects/token-data';

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
    return this.loginService.loginBiometric(
      body?.user,
      body?.signature,
      body?.payload,
    );
  }

  @Get('log_out')
  @UseGuards(JwtAuthGuard)
  async logOut(@Request() request): Promise<any> {
    const data: TokenData = request.payloadData;
    validateTokenData(data);
    return this.loginService.logOut(data.idUsuario);
  }
} //
