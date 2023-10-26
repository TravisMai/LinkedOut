import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/module/redis/redis.service';
import { commonAttribute } from 'src/common/entities/commonAttribute.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly redisService: RedisService) { }

    generateJwtToken(base: commonAttribute): string {
        const payload = { id: base.id, username: base.name, email: base.email, role: base.role };
        return this.jwtService.sign(payload);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const blackListedTokens = await this.redisService.getObjectByKey(`BLACKLIST:${token}`);
        return !!blackListedTokens;
    }

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }

        return {
            message: 'User information from google',
            user: req.user,
        };
    }
}
