import { Staff } from './staffs.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staffs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { OfficersController } from './staffs.controller';
import jwtConfig from 'src/common/jwt/jwt.config';

@Module({
  imports: [TypeOrmModule.forFeature([Staff]), JwtModule.register({
    secret: jwtConfig.secret,
    signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
  })],
  controllers: [OfficersController],
  providers: [StaffService, AuthService]
})
export class OfficersModule { }
