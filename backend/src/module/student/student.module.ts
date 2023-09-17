import { JwtModule } from '@nestjs/jwt';
import { Student } from './student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { StudentService } from './student.service';
import { StaffModule } from '../staff/staff.module';
import { StudentController } from './student.controller';
import { StudentRepository } from './student.repository';
import { CompanyModule } from '../company/company.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    forwardRef(() => StaffModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    AuthService,
    Logger,
    StudentRepository
  ],
  exports: [StudentService],
})
export class StudentModule { }
