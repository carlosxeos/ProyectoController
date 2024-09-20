/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/common';

@Injectable({})
export class JwtWSGuard {
  constructor(private jwtService: JwtService) {}

  async checkToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // TODO: ver la posibilidad de guardar los uuid tambien en el token
      return {
        idTipoUsuario: payload.idTipoUsuario,
        idUsuario: payload.idUsuario,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
