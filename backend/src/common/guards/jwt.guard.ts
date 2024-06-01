import { AuthService } from 'src/module/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');
    const jwtToken = authHeader && authHeader.split(' ')[1];
    const isInBlocklist = await this.authService.isTokenBlacklisted(jwtToken);
    if (isInBlocklist) {
      return false;
    }
    return true;
  }
}
