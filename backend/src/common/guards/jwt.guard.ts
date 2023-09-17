import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/module/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private configService: ConfigService,
        private logger: Logger = new Logger(JwtGuard.name),
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.header('Authorization');
        const jwtToken = authHeader && authHeader.split(' ')[1];
        const isInBlocklist = await this.authService.isTokenBlacklisted(jwtToken);
        if (isInBlocklist) {
            return false;
        }
        return true;

        //   try {
        //     const secret = this.configService.get<string>('JWT_ACCESSKEY');
        //     const payload = await this.jwtService.verify(jwtToken, { secret: secret });
        //     const currentUser = await this.userService.getUserById(payload.id);

        //     if (!currentUser) {
        //       return false;
        //     }

        //     request.idUser = currentUser.id;

        //     return true;
        //   } catch (error) {
        //     this.logger.error(error);
        //     return false;
        //   }
    }
}