import { JwtService } from '@nestjs/jwt';
import { InternshipController } from 'src/module/internship/internship.controller';
import { StudentService } from 'src/module/student/student.service';
import { HttpStatus } from '@nestjs/common';
import { Internship } from 'src/module/internship/internship.entity';
import { InternshipRepository } from 'src/module/internship/internship.repository';
import { InternshipService } from 'src/module/internship/internship.service';
import { JobService } from 'src/module/job/job.service';
import { JobApplicants } from 'src/module/jobApplicants/jobApplicants.entity';
import { JobApplicantsService } from 'src/module/jobApplicants/jobApplicants.service';
import { StaffService } from 'src/module/staff/staff.service';
import { ResumeDTO } from 'src/module/student/dto/resume.dto';
import { Staff } from 'src/module/staff/staff.entity';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import { InternshipUpdateDto } from 'src/module/internship/dto/internshipUpdate.dto';
import { CompanyResponseDto } from 'src/module/company/dto/companyResponse.dto';
import { Faculty } from 'src/module/faculty/faculty.entity';

jest.mock('@nestjs/jwt');
jest.mock('src/module/student/student.service');
jest.mock('src/module/staff/staff.service');
jest.mock('src/module/jobApplicants/jobApplicants.service');
jest.mock('src/module/job/job.service');
jest.mock('src/module/internship/internship.service');
jest.mock('src/module/internship/internship.repository');

describe('InternshipController', () => {
  let controller: InternshipController;
  let jwtService: JwtService;
  let studentService: StudentService;
  let staffService: StaffService;
  let jobApplicantsService: JobApplicantsService;
  let jobService: JobService;
  let internshipService: InternshipService;
  let internshipRepository: InternshipRepository;
  let azureBlobService: AzureBlobService;

  const file: Express.Multer.File = {
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    size: 0,
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
    buffer: undefined,
  };

  const job_applicants = {
    id: 'applicant-id',
    student: {
      faculty: new Faculty(),
      isVerify: false,
      studentId: 0,
      gpa: 0,
      year: 0,
      major: '',
      classCode: '',
      resume: [],
      isActive: false,
      process: '',
      socialMedia: {
        github: '',
        linkedin: '',
        google: '',
        facebook: '',
        twitter: '',
      },
      objective: '',
      education: [],
      workingHistory: [],
      certificate: [],
      skill: [],
      additionalInformation: [],
      reference: [],
      id: '',
      name: '',
      email: '',
      phoneNumber: '',
      avatar: '',
      role: '',
      created: undefined,
      updated: undefined,
    },
    job: {
      id: '1',
      company: new CompanyResponseDto(),
      title: '',
      image: [],
      salary: 0,
      level: '',
      internshipPrograme: '',
      workType: '',
      quantity: 0,
      descriptions: undefined,
      created: undefined,
      updated: undefined,
      isActive: false,
      openDate: undefined,
      expireDate: undefined,
    },
    resume: {
      id: '',
      title: '',
      url: '',
    },
    status: '',
    created: new Date(),
    updated: new Date(),
  };

  const staff: Staff = {
    id: '1',
    name: 'John Doe',
    email: '',
    phoneNumber: '',
    avatar: '',
    role: '',
    created: new Date(),
    updated: new Date(),
    faculty: new Faculty(),
    isAdmin: false,
    staffId: 0,
  };

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {
      sign: jest.fn(),
      decode: jest.fn(),
    };
    const mockStaffService: Partial<StaffService> = {
      findByEmail: jest.fn(),
      getRandomStaff: jest.fn(),
    };
    const mockStudentService: Partial<StudentService> = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getResumeById: jest.fn(),
    };
    const mockJobService: Partial<JobService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockJobApplicantsService: Partial<JobApplicantsService> = {
      findJobApplicantsByCandidateId: jest.fn(),
      findJobApplicantsByJobIdAndCandidateId: jest.fn(),
      create: jest.fn(),
    };
    const mockInternshipService: Partial<InternshipService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCandidateId: jest.fn(),
      findByJobId: jest.fn(),
    };
    const mockInternshipRepository: Partial<InternshipRepository> = {
      findByCandidateId: jest.fn(),
    };
    const mockAzureBlobService: Partial<AzureBlobService> = {
      upload: jest.fn(),
      delete: jest.fn(),
    };

    jwtService = mockJwtService as JwtService;
    staffService = mockStaffService as StaffService;
    studentService = mockStudentService as StudentService;
    jobService = mockJobService as JobService;
    jobApplicantsService = mockJobApplicantsService as JobApplicantsService;
    internshipService = mockInternshipService as InternshipService;
    internshipRepository = mockInternshipRepository as InternshipRepository;
    azureBlobService = mockAzureBlobService as AzureBlobService;
    controller = new InternshipController(
      jwtService,
      studentService,
      jobService,
      jobApplicantsService,
      internshipService,
      internshipRepository,
      staffService,
      azureBlobService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('applyInternship', () => {
    it('should apply for an internship and return created internship', async () => {
      const req = {
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const student = { id: 'student-id' };
      const decodedToken = { id: 'student-id' };
      const newJobApplicants = new JobApplicants();
      const newInternship = new Internship();

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(student as any);
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockResolvedValue([]);
      jest
        .spyOn(jobService, 'findOne')
        .mockResolvedValue({ id: 'job-id' } as any);
      jest
        .spyOn(studentService, 'getResumeById')
        .mockResolvedValue(Promise.resolve({}) as Promise<ResumeDTO>);
      jest
        .spyOn(jobApplicantsService, 'create')
        .mockResolvedValue(newJobApplicants);
      jest
        .spyOn(internshipRepository, 'findByCandidateId')
        .mockResolvedValue([]);
      jest
        .spyOn(staffService, 'getRandomStaff')
        .mockResolvedValue(Promise.resolve({}) as Promise<Staff>);
      jest.spyOn(internshipService, 'create').mockResolvedValue(newInternship);

      await controller.applyInternship(
        req as any,
        res as any,
        'job-id',
        'resume-id',
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(newInternship);
    });

    it('should return 404 if student not found', async () => {
      const req = {
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const decodedToken = { id: 'student-id' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);

      await controller.applyInternship(
        req as any,
        res as any,
        'job-id',
        'resume-id',
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found!' });
    });

    it('should handle errors', async () => {
      const req = {
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const decodedToken = { id: 'student-id' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(studentService, 'findOne')
        .mockRejectedValue(new Error('Test error'));

      await controller.applyInternship(
        req as any,
        res as any,
        'job-id',
        'resume-id',
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findAll', () => {
    it('should return all internships', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internships = [new Internship()];

      jest.spyOn(internshipService, 'findAll').mockResolvedValue(internships);

      await controller.findAll(res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(internships);
    });

    it('should return 404 if no internships found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(internshipService, 'findAll').mockResolvedValue([]);

      await controller.findAll(res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No internships found!',
      });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(internshipService, 'findAll')
        .mockRejectedValue(new Error('Test error'));

      await controller.findAll(res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findOne', () => {
    it('should return an internship by id', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internship = new Internship();

      jest.spyOn(internshipService, 'findOne').mockResolvedValue(internship);

      await controller.findOne(res as any, 'internship-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(internship);
    });

    it('should return 404 if internship not found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(internshipService, 'findOne').mockResolvedValue(null);

      await controller.findOne(res as any, 'internship-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internship not found!',
      });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(internshipService, 'findOne')
        .mockRejectedValue(new Error('Test error'));

      await controller.findOne(res as any, 'internship-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('update', () => {
    it('should update an internship and return updated internship', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internship = new InternshipUpdateDto();
      const updatedInternship = new Internship();

      jest
        .spyOn(internshipService, 'findOne')
        .mockResolvedValue(updatedInternship);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('document-url');
      jest
        .spyOn(internshipService, 'update')
        .mockResolvedValue(updatedInternship);

      await controller.update(
        { document: [file] },
        res as any,
        'internship-id',
        internship,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(updatedInternship);
    });

    it('should delete specified documents and update internship', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internship = new InternshipUpdateDto();
      internship.deleteDocumentID = ['doc-id-1'];

      const existingDocument = {
        id: 'doc-id-1',
        name: 'doc-1',
        url: 'http://example.com/doc1',
      };
      const findInternship: Internship = {
        id: 'internship-id',
        jobApplicants: job_applicants,
        staff: staff,
        result: 10,
        document: [existingDocument],
        created: undefined,
        updated: undefined,
      };

      const updatedInternship = new Internship();

      jest
        .spyOn(internshipService, 'findOne')
        .mockResolvedValue(findInternship);
      jest.spyOn(azureBlobService, 'delete').mockResolvedValue(undefined);
      jest
        .spyOn(internshipService, 'update')
        .mockResolvedValue(updatedInternship);

      await controller.update(
        { document: [] },
        res as any,
        'internship-id',
        internship,
      );

      expect(azureBlobService.delete).toHaveBeenCalledWith('doc1');
      expect(internshipService.update).toHaveBeenCalledWith(
        'internship-id',
        expect.objectContaining({
          document: [],
        }),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(updatedInternship);
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internship = new InternshipUpdateDto();
      const updatedInternship = new Internship();

      jest
        .spyOn(internshipService, 'findOne')
        .mockResolvedValue(updatedInternship);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('document-url');
      jest
        .spyOn(internshipService, 'update')
        .mockRejectedValue(new Error('Test error'));

      await controller.update(
        { document: [file] },
        res as any,
        'internship-id',
        internship,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findByCandidateId', () => {
    it('should return all internships by candidate id', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internships = [new Internship()];

      jest
        .spyOn(internshipService, 'findByCandidateId')
        .mockResolvedValue(internships);

      await controller.findByCandidateId(res as any, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(internships);
    });

    it('should return 404 if no internships found for candidate', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(internshipService, 'findByCandidateId').mockResolvedValue([]);

      await controller.findByCandidateId(res as any, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No internships found!',
      });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(internshipService, 'findByCandidateId')
        .mockRejectedValue(new Error('Test error'));

      await controller.findByCandidateId(res as any, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findByJobId', () => {
    it('should return all internships by job id', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const internships = [new Internship()];

      jest
        .spyOn(internshipService, 'findByJobId')
        .mockResolvedValue(internships);

      await controller.findByJobId(res as any, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(internships);
    });

    it('should return 404 if no internships found for job', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(internshipService, 'findByJobId').mockResolvedValue([]);

      await controller.findByJobId(res as any, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No internships found!',
      });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(internshipService, 'findByJobId')
        .mockRejectedValue(new Error('Test error'));

      await controller.findByJobId(res as any, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });

    it('should return 404 if no internships found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(internshipService, 'findByJobId').mockResolvedValue([]);

      await controller.findByJobId(res as any, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No internships found!',
      });
    });
  });
});
