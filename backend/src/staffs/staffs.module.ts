import { Staff } from './staffs.entity';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staffs.service';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { StaffsController } from './staffs.controller';

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
    Logger,
  ],
  exports: [JwtModule],
})
export class StaffModule { }
