import { Staff } from './staff.entity';
import { JwtModule } from '@nestjs/jwt';
import { StaffService } from './staff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { StaffController } from './staff.controller';
import { StaffRepository } from './staff.repository';
import { CompanyModule } from '../company/company.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    forwardRef(() => StudentModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [StaffController],
  providers: [
    StaffService,
    AuthService,
    Logger,
    StaffRepository,
  ],
  exports: [StaffService],
})
export class StaffModule { }
