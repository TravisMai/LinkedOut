import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import jwtConfig from 'src/common/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/module/redis/redis.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule
  ],
  providers: [ AuthService],
  exports: [JwtModule],
  controllers: [],
})
export class AuthModule {}
