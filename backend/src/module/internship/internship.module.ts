import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { CompanyModule } from '../company/company.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { Internship } from './internship.entity';
import { StaffModule } from '../staff/staff.module';
import { JobModule } from '../job/job.module';
import { InternshipController } from './internship.controller';
import { InternshipService } from './internship.service';
import { InternshipRepository } from './internship.repository';
import { JobApplicantsModule } from '../jobApplicants/jobApplicants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Internship]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    CompanyModule,
    StudentModule,
    StaffModule,
    JobModule,
    JobApplicantsModule,
  ],
  controllers: [InternshipController],
  providers: [AuthService, Logger, InternshipService, InternshipRepository],
  exports: [InternshipService, InternshipRepository],
})
export class InternshipModule {}
