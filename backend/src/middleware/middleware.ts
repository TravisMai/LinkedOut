import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1]; // Get the token from the request
    const isBlacklisted = await this.authService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    next();
  }
}
