import { Request, Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JobApplicants } from '../jobApplicants/jobApplicants.entity';
import { StudentService } from '../student/student.service';
import { StaffService } from '../staff/staff.service';
import { JwtService } from '@nestjs/jwt';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import { JobApplicantsService } from '../jobApplicants/jobApplicants.service';
import { JobService } from '../job/job.service';
import { InternshipService } from '../internship/internship.service';
import { InternshipRepository } from '../internship/internship.repository';
import { Internship } from './internship.entity';

@Controller('internship')
export class InternshipController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly jobService: JobService,
    private readonly jobApplicantsService: JobApplicantsService,
    private readonly internshipService: InternshipService,
    private readonly internshipRepository: InternshipRepository,
    private readonly staffService: StaffService,
  ) {}

  // apply for an internship, when the student applies for an internship, the student will be added to the internship and the jobApplicants table
  @Post(':id')
  @AllowRoles(['student'])
  @UseGuards(JwtGuard, RolesGuard)
  async applyInternship(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
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

      const findJobApplicant =
        await this.jobApplicantsService.findJobApplicantsByCandidateId(
          decodedToken.id,
        );
      let newJobApplicants;
      if (findJobApplicant && findJobApplicant.length > 0) {
        const job = findJobApplicant.find((job) => job.job.id === id);
        if (job) {
          newJobApplicants =
            await this.jobApplicantsService.findJobApplicantsByJobIdAndCandidateId(
              job.job.id,
              student.id,
            );
        }
      } else {
        // create a new jobApplicants
        const jobApplicants = new JobApplicants();
        jobApplicants.student = student;
        const job = await this.jobService.findOne(id);
        jobApplicants.job = job;
        newJobApplicants =
          await this.jobApplicantsService.create(jobApplicants);
      }
      // if the internship already exists, remove the student from the internship
      const findInternship = await this.internshipRepository.findByCandidateId(
        student.id,
      );
      if (findInternship && findInternship.length > 0) {
        const internship = findInternship.find(
          (internship) => internship.jobApplicants.id === newJobApplicants.id,
        );
        if (internship) {
          await this.internshipService.delete(internship.id);
          return response
            .status(HttpStatus.OK)
            .json({ message: 'Delete internship successfully' });
        }
      }
      // create a new internship
      const internship = new Internship();
      internship.jobApplicants = newJobApplicants;

      // get random staff
      const staff = await this.staffService.getRandomStaff();
      internship.staff = staff;

      const newInternship = await this.internshipService.create(internship);
      return response.status(HttpStatus.CREATED).json(newInternship);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get all internships
  @Get()
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAll(@Res() response: Response): Promise<Response> {
    try {
      const internships = await this.internshipService.findAll();
      if (!internships || internships.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No internships found!' });
      }
      return response.status(HttpStatus.OK).json(internships);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get an internship by id
  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const internship = await this.internshipService.findOne(id);
      if (!internship) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Internship not found!' });
      }
      return response.status(HttpStatus.OK).json(internship);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // update an internship
  @Put(':id')
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() internship: Internship,
  ): Promise<Response> {
    try {
      const updatedInternship = await this.internshipService.update(
        id,
        internship,
      );
      return response.status(HttpStatus.OK).json(updatedInternship);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get all internship by candidateId
  @Get('candidate/:id')
  @AllowRoles(['student', 'staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async findByCandidateId(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const internships = await this.internshipService.findByCandidateId(id);
      if (!internships || internships.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No internships found!' });
      }
      return response.status(HttpStatus.OK).json(internships);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
