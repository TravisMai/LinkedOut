import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
      const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!allowedRoles) {
          return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        
        if (!token) {
            return false;
        }
        
        try {
            const decodedToken = this.jwtService.verify(token.replace('Bearer ', ''));
            const userRole = decodedToken.role;
            
            return allowedRoles.includes(userRole);
    } catch (error) {
      return false;
    }
  }
}
