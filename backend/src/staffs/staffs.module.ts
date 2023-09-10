import { Staff } from './staffs.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staffs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { StaffsController } from './staffs.controller';
import jwtConfig from 'src/common/jwt/jwt.config';
import { RedisModule } from 'src/redis/redis.module';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
  ],
  controllers: [StaffsController],
  providers: [StaffService, AuthService, JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class StaffModule { }
