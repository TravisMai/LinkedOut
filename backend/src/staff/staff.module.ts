import { Staff } from './staff.entity';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staff.service';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { StaffController } from './staff.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
  ],
  controllers: [StaffController],
  providers: [
    StaffService,
    AuthService,
    Logger,
  ],
  exports: [JwtModule],
})
export class StaffModule { }
