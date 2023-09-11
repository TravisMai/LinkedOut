// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
      const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!allowedRoles) {
          return true; // If no roles are specified, allow access by default
        }
        
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization; // Assuming you store the JWT in the Authorization header
        
        if (!token) {
            return false; // No token found, deny access
        }
        
        try {
            const decodedToken = this.jwtService.verify(token.replace('Bearer ', '')); // Remove 'Bearer ' prefix if present
            const userRole = decodedToken.role; // Assuming the JWT payload contains a 'role' field
            
            return allowedRoles.includes(userRole); // Check if the user's role is allowed
    } catch (error) {
      return false; // Invalid token, deny access
    }
  }
}
