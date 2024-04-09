import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from 'src/module/auth/auth.module';
import { AppController } from './app.controller';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisModule } from 'src/module/redis/redis.module';
import { StaffModule } from 'src/module/staff/staff.module';
import { StudentModule } from '../module/student/student.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompanyModule } from 'src/module/company/company.module';
import { JobModule } from 'src/module/job/job.module';
import { FacultyModule } from 'src/module/faculty/faculty.module';
import { InternshipModule } from 'src/module/internship/internship.module';
import { JobApplicantsModule } from 'src/module/jobApplicants/jobApplicants.module';
import { Module, ValidationPipe, Logger } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    AuthModule,
    RedisModule,
    StaffModule,
    StudentModule,
    CompanyModule,
    FacultyModule,
    InternshipModule,
    JobApplicantsModule,
    JobModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AuthService,
    Logger,
  ],
})
export class AppModule {}
