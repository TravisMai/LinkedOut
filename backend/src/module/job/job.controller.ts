import validate = require('uuid-validate');
import { Request, Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  expireTimeOneHour,
  JobListKey,
} from 'src/common/variables/constVariable';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Job } from './job.entity';
import { CompanyService } from '../company/company.service';
import { StudentService } from '../student/student.service';
import { StaffService } from '../staff/staff.service';
import { RedisService } from '../redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import { JobService } from './job.service';
import { JobResponseDto } from './dto/JobResponse.dto';
import { CompanyResponseDto } from '../company/dto/companyResponse.dto';

@Controller('job')
export class JobController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly staffService: StaffService,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly jobService: JobService,
  ) {}

  // get all the jobs
  @Get()
  @AllowRoles(['staff', 'student'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAll(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const cachedData = await this.redisService.getObjectByKey(JobListKey);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const findAllResult = await this.jobService.findAll();
        if (!findAllResult || findAllResult.length === 0) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Job list is empty!' });
        }

        const limitedData = JobResponseDto.fromJobArray(findAllResult);
        await this.redisService.setObjectByKeyValue(
          JobListKey,
          limitedData,
          120,
        );
        return response.status(HttpStatus.OK).json(limitedData);
      }
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // Get all jobs by company id
  @Get('company')
  @AllowRoles(['company'])
  @UseGuards(JwtGuard)
  async findAllByCompanyId(
    @Req() req: any,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      const jobs = await this.jobService.findAllByCompanyId(decodedToken.id);
      if (!jobs || jobs.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No job found!' });
      }
      // const limitedData = JobResponseDto.fromJobArray(jobs);
      return response.status(HttpStatus.OK).json(jobs);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // create a job
  @Post()
  @AllowRoles(['company'])
  @UseGuards(JwtGuard, RolesGuard)
  async create(
    @Body() job: Job,
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      job.company = CompanyResponseDto.fromCompany(
        await this.companyService.findOne(decodedToken.id),
      );
      const newCreateJob = await this.jobService.create(job);
      const limitedData = JobResponseDto.fromJob(newCreateJob);
      await this.redisService.setObjectByKeyValue(
        `JOB:${newCreateJob.id}`,
        limitedData,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.CREATED).json({ job: newCreateJob });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get job by id
  @Get(':id')
  @AllowRoles(['staff', 'student'])
  @UseGuards(JwtGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const cachedData = await this.redisService.getObjectByKey(`JOB:${id}`);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const job = await this.jobService.findOne(id);
        if (!job) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Job not found!' });
        }
        // const limitedData = JobResponseDto.fromJob(job);
        await this.redisService.setObjectByKeyValue(
          `JOB:${id}`,
          job,
          expireTimeOneHour,
        );
        return response.status(HttpStatus.OK).json(job);
      }
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // update a job
  @Put(':id')
  @AllowRoles(['company'])
  @UseGuards(JwtGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() job: Job,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const updateJob = await this.jobService.update(id, job);
      if (!updateJob) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Job not found!' });
      }
      const limitedData = JobResponseDto.fromJob(updateJob);
      await this.redisService.setObjectByKeyValue(
        `JOB:${id}`,
        limitedData,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // delete a job
  @Delete(':id')
  @AllowRoles(['company', 'staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    if (!validate(id)) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid UUID format' });
    }
    const job = await this.jobService.findOne(id);
    if (!job) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No job found!' });
    }
    await this.jobService.delete(id);
    await this.redisService.deleteObjectByKey(`JOB:${id}`);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Job deleted successfully!' });
  }

  // get jobs with criteria
  @Post('search')
  @AllowRoles(['staff', 'student'])
  @UseGuards(JwtGuard, RolesGuard)
  async findJobsWithCriteria(
    @Body() criteria: Partial<Job>,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const findJobsWithCriteriaResult =
        await this.jobService.findJobsWithCriteria(criteria);
      if (
        !findJobsWithCriteriaResult ||
        findJobsWithCriteriaResult.length === 0
      ) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No job found!' });
      }
      const limitedData = JobResponseDto.fromJobArray(
        findJobsWithCriteriaResult,
      );
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
