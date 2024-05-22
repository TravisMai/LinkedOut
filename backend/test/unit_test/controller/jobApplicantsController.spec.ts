import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { JobService } from 'src/module/job/job.service';
import { ApplyJobDTO } from 'src/module/jobApplicants/dto/applyJob.dto';
import { JobApplicantsController } from 'src/module/jobApplicants/jobApplicants.controller';
import { JobApplicantsService } from 'src/module/jobApplicants/jobApplicants.service';
import { StudentService } from 'src/module/student/student.service';
import { Job } from 'src/module/job/job.entity';
import { JobApplicants } from 'src/module/jobApplicants/jobApplicants.entity';
import { ResumeDTO } from 'src/module/student/dto/resume.dto';
import { Student } from 'src/module/student/student.entity';
import { CompanyResponseDto } from 'src/module/company/dto/companyResponse.dto';
import { Faculty } from 'src/module/faculty/faculty.entity';

jest.mock('@nestjs/jwt');
jest.mock('src/module/student/student.service');
jest.mock('src/module/staff/staff.service');
jest.mock('src/module/jobApplicants/jobApplicants.service');
jest.mock('src/module/job/job.service');
jest.mock('src/module/internship/internship.service');
jest.mock('src/module/internship/internship.repository');
describe('JobApplicantsController', () => {
  let controller: JobApplicantsController;
  let jobApplicantsService: JobApplicantsService;
  let studentService: StudentService;
  let jobService: JobService;
  let jwtService: JwtService;

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

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {
      sign: jest.fn(),
      decode: jest.fn(),
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
      update: jest.fn(),
      delete: jest.fn(),
      findJobApplicantsByJobId: jest.fn(),
      findOne: jest.fn(),
    };

    jwtService = mockJwtService as JwtService;
    studentService = mockStudentService as StudentService;
    jobService = mockJobService as JobService;
    jobApplicantsService = mockJobApplicantsService as JobApplicantsService;
    controller = new JobApplicantsController(
      jwtService,
      studentService,
      jobService,
      jobApplicantsService,
    );
  });

  describe('applyJob', () => {
    it('should apply for a job', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const applyJobDto: ApplyJobDTO = { resumeId: 'test-resume-id' };
      const job = new Job();

      const decodedToken = { id: 'student-id' };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(studentService, 'findOne')
        .mockResolvedValue(
          Promise.resolve({ id: 'student-id' }) as Promise<Student>,
        );
      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest.spyOn(studentService, 'getResumeById').mockResolvedValue({
        id: 'resume-id',
        title: '',
        url: '',
      } as ResumeDTO);
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockResolvedValue([]);
      jest
        .spyOn(jobApplicantsService, 'create')
        .mockResolvedValue(
          Promise.resolve({ id: 'job-applicant-id' }) as Promise<JobApplicants>,
        );

      await controller.applyJob(req, res, 'job-id', applyJobDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 'job-applicant-id' });
    });

    it('should delete a job if already applied', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const applyJobDto: ApplyJobDTO = { resumeId: 'test-resume-id' };
      const job = new Job();

      const decodedToken = { id: 'student-id' };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(studentService, 'findOne')
        .mockResolvedValue(
          Promise.resolve({ id: 'student-id' }) as Promise<Student>,
        );
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockResolvedValue([job_applicants]);
      jest
        .spyOn(jobApplicantsService, 'delete')
        .mockResolvedValue(Promise.resolve() as Promise<void>);

      await controller.applyJob(req, res, '1', applyJobDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Delete job apply successfully',
      });
    });

    it('should return 404 if student not found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const applyJobDto: ApplyJobDTO = { resumeId: 'test-resume-id' };

      const decodedToken = { id: 'student-id' };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);

      await controller.applyJob(req, res, 'job-id', applyJobDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found!' });
    });

    it('should return 500 INTERNAL SERVER ERROR if unexpected error occur', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const applyJobDto: ApplyJobDTO = { resumeId: 'test-resume-id' };

      const decodedToken = { id: 'student-id' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(studentService, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await controller.applyJob(req, res, 'job-id', applyJobDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
  });

  describe('findAllCandidateByJobId', () => {
    it('should return all candidates for a job', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const job = new Job();

      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByJobId')
        .mockResolvedValue([job_applicants]);

      await controller.findAllCandidateByJobId(req, res, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([job_applicants]);
    });

    it('should return 404 if job not found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(jobService, 'findOne').mockResolvedValue(null);

      await controller.findAllCandidateByJobId(req, res, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job not found!' });
    });

    it('should return 404 if no applicant found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const job = new Job();

      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByJobId')
        .mockResolvedValue([]);

      await controller.findAllCandidateByJobId(req, res, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No applicants found!',
      });
    });

    it('should return 500 if unexpected error occur', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const job = new Job();

      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByJobId')
        .mockRejectedValue(new Error('Unexpected error'));

      await controller.findAllCandidateByJobId(req, res, 'job-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
  });

  describe('findAllJobByCandidateId', () => {
    it('should return all jobs applied by a candidate', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockResolvedValue([job_applicants]);

      await controller.findAllJobByCandidateId(req, res, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([job_applicants]);
    });

    it('should return 404 if no job found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockResolvedValue([]);

      await controller.findAllJobByCandidateId(req, res, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No applied job found!',
      });
    });

    it('should return 500 if unexpected error occur', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'findJobApplicantsByCandidateId')
        .mockRejectedValue(new Error('Unexpected error'));

      await controller.findAllJobByCandidateId(req, res, 'candidate-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
  });

  describe('findOne', () => {
    it('should return a job applicant', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'findOne')
        .mockResolvedValue(job_applicants);

      await controller.findOne(req, res, 'applicant-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(job_applicants);
    });

    it('should return 404 if job applicant not found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(jobApplicantsService, 'findOne').mockResolvedValue(null);

      await controller.findOne(req, res, 'applicant-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Job applicant not found!',
      });
    });

    it('should return 500 if unexpected error occurs', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await controller.findOne(req, res, 'applicant-id');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
  });

  describe('update', () => {
    it('should update a job applicant', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'update')
        .mockResolvedValue(job_applicants);

      await controller.update(req, res, 'applicant-id', job_applicants);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(job_applicants);
    });

    it('should return 404 if job applicant not found', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(jobApplicantsService, 'update').mockResolvedValue(null);

      await controller.update(req, res, 'applicant-id', job_applicants);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Job applicant not found!',
      });
    });

    it('should return 500 if unexpected error occurs', async () => {
      const req = { headers: { authorization: 'Bearer test-token' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(jobApplicantsService, 'update')
        .mockRejectedValue(new Error('Unexpected error'));

      await controller.update(req, res, 'applicant-id', job_applicants);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
  });
});
