import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'src/common/jwt/jwt.config';
import { CompanyModule } from '../company/company.module';
import { StudentModule } from '../student/student.module';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { Internship } from './internship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Internship]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class InternshipModule {}
