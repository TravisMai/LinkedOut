import jwtConfig from './jwt.config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  allowedRoles: string[];
  constructor(options: { allowedRoles: string[] }) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });

    this.allowedRoles = options.allowedRoles;
  }

  async validate(payload: any) {
    if (!this.allowedRoles.includes(payload.role)) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
