import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { commonAttribute } from 'src/common/entity/commonAttribute.entity';
import { RedisService } from 'src/redis/redis.service';

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
}
