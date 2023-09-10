import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/common/jwt/jwt.config';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
  ],
  providers: [ AuthService],
  exports: [JwtModule],
  controllers: [],
})
export class AuthModule {}
