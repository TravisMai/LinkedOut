import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CompanyService } from 'src/module/company/company.service';
import { InternshipRepository } from 'src/module/internship/internship.repository';
import { InternshipService } from 'src/module/internship/internship.service';
import { JobApplicantsService } from 'src/module/jobApplicants/jobApplicants.service';
import { JobService } from 'src/module/job/job.service';
import { StudentService } from 'src/module/student/student.service';
import { StaffService } from 'src/module/staff/staff.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Req,
  Query,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly jobService: JobService,
    private readonly jobApplicantsService: JobApplicantsService,
    private readonly internshipService: InternshipService,
    private readonly internshipRepository: InternshipRepository,
    private readonly staffService: StaffService,
    private readonly companyService: CompanyService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async search(
    @Req() req: Request,
    @Res() response: Response,
    @Body('search') search: string,
  ): Promise<Response> {
    try {
      // take the search and pass to the service
      const searchResult = await this.appService.search(search);
      return response.status(HttpStatus.OK).json(searchResult);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
