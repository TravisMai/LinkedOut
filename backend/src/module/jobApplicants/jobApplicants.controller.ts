import { Request, Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { JobApplicants } from './jobApplicants.entity';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import { JobApplicantsService } from './jobApplicants.service';
import { JobService } from '../job/job.service';
import { ApplyJobDTO } from './dto/applyJob.dto';

@Controller('job_applicants')
export class JobApplicantsController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly jobService: JobService,
    private readonly jobApplicantsService: JobApplicantsService,
  ) {}

  @Post(':id')
  @AllowRoles(['student'])
  @UseGuards(JwtGuard, RolesGuard)
  async applyJob(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() ApplyJob: ApplyJobDTO,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      const student = await this.studentService.findOne(decodedToken.id);
      if (!student) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Student not found!' });
      }
      const findApplicant =
        await this.jobApplicantsService.findJobApplicantsByCandidateId(
          decodedToken.id,
        );
      if (findApplicant && findApplicant.length > 0) {
        const job = findApplicant.find((job) => job.job.id === id);
        if (job) {
          // delete the job applicant
          await this.jobApplicantsService.delete(job.id);
          return response
            .status(HttpStatus.OK)
            .json({ message: 'Delete job apply successfully' });
        }
      }
      const jobApplicants = new JobApplicants();
      jobApplicants.student = student;
      const job = await this.jobService.findOne(id);
      jobApplicants.job = job;
      const resume = await this.studentService.getResumeById(
        student.id,
        ApplyJob.resumeId,
      );
      jobApplicants.resume = resume;
      const newJobApplicants =
        await this.jobApplicantsService.create(jobApplicants);
      return response.status(HttpStatus.CREATED).json(newJobApplicants);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findAllCandidateByJobId(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const job = await this.jobService.findOne(id);
      if (!job) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Job not found!' });
      }
      const jobApplicants =
        await this.jobApplicantsService.findJobApplicantsByJobId(id);
      if (!jobApplicants || jobApplicants.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No applicants found!' });
      }
      return response.status(HttpStatus.OK).json(jobApplicants);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // find all applied job by candidate id
  @Get('candidate/:id')
  @AllowRoles(['student', 'staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAllJobByCandidateId(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const jobApplicants =
        await this.jobApplicantsService.findJobApplicantsByCandidateId(id);
      if (!jobApplicants || jobApplicants.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No applied job found!' });
      }
      return response.status(HttpStatus.OK).json(jobApplicants);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get a job applicant by jobApplicant id
  @Get('applicant/:id')
  @AllowRoles(['company', 'staff'])
  @UseGuards(JwtGuard)
  async findOne(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const jobApplicant =
        await this.jobApplicantsService.findOne(id);
      if (!jobApplicant) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Job applicant not found!' });
      }
      return response.status(HttpStatus.OK).json(jobApplicant);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
