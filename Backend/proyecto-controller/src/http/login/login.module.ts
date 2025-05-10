/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/common';

/**
 * Obtiene lo relacionado a login(login, logout, logeo biometrico)
 */
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
