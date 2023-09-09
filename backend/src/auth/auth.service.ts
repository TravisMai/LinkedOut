import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { commonAttribute } from 'src/common/entity/commonAttribute.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    generateJwtToken(base: commonAttribute): string {
        const payload = { id: base.id, username: base.name, email: base.email };
        return this.jwtService.sign(payload);
    }
}
