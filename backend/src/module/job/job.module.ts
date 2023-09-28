import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { StaffModule } from '../staff/staff.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { Job } from './job.entity';
import { CompanyModule } from '../company/company.module';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobRepository } from './job.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    CompanyModule,
    StaffModule,
    StudentModule,
  ],
  controllers: [JobController],
  providers: [
    AuthService,
    Logger,
    JobService,
    JobRepository
  ],
  exports: [],
})
export class JobModule { }
