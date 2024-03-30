import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { CompanyModule } from '../company/company.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { JobApplicants } from './jobApplicants.entity';
import { JobApplicantsController } from './jobApplicants.controller';
import { JobApplicantsService } from './jobApplicants.service';
import { JobApplicantsRepository } from './jobApplicants.repository';
import { StaffModule } from '../staff/staff.module';
import { JobModule } from '../job/job.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicants]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    CompanyModule,
    StudentModule,
    StaffModule,
    JobModule,
  ],
  controllers: [JobApplicantsController],
  providers: [
    AuthService,
    Logger,
    JobApplicantsService,
    JobApplicantsRepository
  ],
  exports: [],
})
export class JobApplicantsModule {}
