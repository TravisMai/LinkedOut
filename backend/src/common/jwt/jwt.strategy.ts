import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import jwtConfig from './jwt.config';

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
    // Add custom logic to validate user roles here
    // You may want to check user roles from the payload
    // and throw UnauthorizedException if the user is not authorized.
    if (!this.allowedRoles.includes(payload.role)) {
      throw new UnauthorizedException();
    }

    return payload; // Return the validated user data
  }
}
