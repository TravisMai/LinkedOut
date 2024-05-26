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
  UseInterceptors,
  UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InternshipUpdateDto } from './dto/internshipUpdate.dto';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { InternshipDocumentDTO } from './dto/document.dto';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly azureBlobService: AzureBlobService,
  ) {}

  // apply for an internship, when the student applies for an internship, the student will be added to the internship and the jobApplicants table
  @Post(':id')
  @AllowRoles(['student'])
  @UseGuards(JwtGuard, RolesGuard)
  async applyInternship(
    @Req() req: Request,
    @Res() response: Response,
    @Param('id') id: string,
    @Body('resumeId') resumeId: string,
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
        const resume = await this.studentService.getResumeById(
          student.id,
          resumeId,
        );
        jobApplicants.resume = resume;
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
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
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
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
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
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // update an internship
  @Put(':id')
  @AllowRoles(['staff', 'company', 'student'])
  @UseInterceptors(FileFieldsInterceptor([{ name: 'document', maxCount: 1 }]))
  @UseGuards(JwtGuard, RolesGuard)
  async update(
    @UploadedFiles()
    files: { document?: Express.Multer.File[] },
    @Res() response: Response,
    @Param('id') id: string,
    @Body() internship: InternshipUpdateDto,
  ): Promise<Response> {
    try {
      const findInternship = await this.internshipService.findOne(id);
      const currentDocument = findInternship.document || [];
      if (
        internship.deleteDocumentID &&
        internship.deleteDocumentID.length > 0
      ) {
        for (let i = currentDocument.length - 1; i >= 0; i--) {
          const document = currentDocument[i];
          if (internship.deleteDocumentID.includes(document.id)) {
            await this.azureBlobService.delete(document.url.split('/').pop());
            currentDocument.splice(i, 1);
          }
        }
        delete internship.deleteDocumentID;
        internship.document = currentDocument;
      }
      const documentName =
        internship.documentName || files?.document?.[0]?.originalname;
      delete internship.documentName;
      if (files?.document?.[0]) {
        const documentUrl = await this.azureBlobService.upload(
          files.document[0],
        );
        const newDocumentDto = new InternshipDocumentDTO();
        newDocumentDto.id = uuidv4();
        newDocumentDto.name = documentName;
        newDocumentDto.url = documentUrl;
        const updatedDocument = [...currentDocument, newDocumentDto];
        internship.document = updatedDocument;
      }
      const updatedInternship = await this.internshipService.update(id, {
        ...internship,
      } as unknown as Internship);
      return response.status(HttpStatus.OK).json(updatedInternship);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
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
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // get all internship by jobId
  @Get('job/:id')
  @AllowRoles(['staff', 'company'])
  @UseGuards(JwtGuard, RolesGuard)
  async findByJobId(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const internships = await this.internshipService.findByJobId(id);
      if (!internships || internships.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No internships found!' });
      }
      return response.status(HttpStatus.OK).json(internships);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
