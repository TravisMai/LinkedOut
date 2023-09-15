import { JwtModule } from '@nestjs/jwt';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { CompanyService } from './company.service';
import { StaffModule } from '../staff/staff.module';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    forwardRef(() => StudentModule),
    forwardRef(() => StaffModule),
  ],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    AuthService,
    Logger,
    CompanyRepository,
  ],
  exports: [CompanyService],
})
export class CompanyModule { }
