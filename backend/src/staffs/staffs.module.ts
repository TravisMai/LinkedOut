import { Staff } from './staffs.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staffs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { StaffsController } from './staffs.controller';
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
  providers: [
    StaffService,
    AuthService,
    {
      provide: JwtStrategy,
      useValue: new JwtStrategy({ allowedRoles: ['staff'] }),
    },
  ],
  exports: [JwtModule, JwtStrategy],
})
export class StaffModule { }
