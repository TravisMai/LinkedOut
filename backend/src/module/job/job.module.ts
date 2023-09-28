import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { StaffModule } from '../staff/staff.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { Job } from './job.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    CompanyModule
  ],
  controllers: [],
  providers: [
    AuthService,
    Logger,
  ],
  exports: [],
})
export class JobModule { }
