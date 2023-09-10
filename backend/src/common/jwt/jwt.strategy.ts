import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import jwtConfig from './jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    // Add custom logic to validate user roles here
    // You may want to check user roles from the payload
    // and throw UnauthorizedException if the user is not authorized.
    // Example: if (payload.role !== 'admin') throw new UnauthorizedException();
    if (payload.role !== 'staff') throw new UnauthorizedException();

    return payload; // Return the validated user data
  }
}