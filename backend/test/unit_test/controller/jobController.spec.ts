import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { JobController } from 'src/module/job/job.controller';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { AuthService } from 'src/module/auth/auth.service';
import { CompanyService } from 'src/module/company/company.service';
import { JobResponseDto } from 'src/module/job/dto/JobResponse.dto';
import { Job } from 'src/module/job/job.entity';
import { JobService } from 'src/module/job/job.service';
import { RedisService } from 'src/module/redis/redis.service';
import { StaffService } from 'src/module/staff/staff.service';
import { StudentService } from 'src/module/student/student.service';
import validate = require('uuid-validate');
import { Company } from 'src/module/company/company.entity';

jest.mock('uuid-validate');
describe('JobController', () => {
  let controller: JobController;
  let jobService: JobService;
  let redisService: RedisService;
  let jwtService: JwtService;
  let authService: AuthService;
  let studentService: StudentService;
  let staffService: StaffService;
  let companyService: CompanyService;
  let azureBlobService: AzureBlobService;

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
      findAllByCompanyId: jest.fn(),
      findJobsWithCriteria: jest.fn(),
      findOneIncludeDeactiveAccount: jest.fn(),
    };
    const mockCompanyService: Partial<CompanyService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockAzureBlobService: Partial<AzureBlobService> = {
      upload: jest.fn(),
      delete: jest.fn(),
    };
    const mockAuthService: Partial<AuthService> = {
      generateJwtToken: jest.fn(),
    };
    const mockRedisService: Partial<RedisService> = {
      setObjectByKeyValue: jest.fn(),
      getObjectByKey: jest.fn(),
      deleteObjectByKey: jest.fn(),
    };

    jwtService = mockJwtService as JwtService;
    staffService = mockStaffService as StaffService;
    studentService = mockStudentService as StudentService;
    jobService = mockJobService as JobService;
    companyService = mockCompanyService as CompanyService;
    azureBlobService = mockAzureBlobService as AzureBlobService;
    authService = mockAuthService as AuthService;
    redisService = mockRedisService as RedisService;
    controller = new JobController(
      jwtService,
      authService,
      redisService,
      staffService,
      studentService,
      companyService,
      jobService,
      azureBlobService,
    );
  });

  describe('findAll', () => {
    it('should return cached data if available', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const cachedData = [{ id: '1', title: 'Test Job' }];

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);

      await controller.findAll({} as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(cachedData);
    });

    it('should return job list and cache it if not cached', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const jobs = [new Job()];

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(jobService, 'findAll').mockResolvedValue(jobs);
      jest.spyOn(redisService, 'setObjectByKeyValue').mockResolvedValue(null);

      await controller.findAll({} as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(JobResponseDto.fromJobArray(jobs));
      expect(redisService.setObjectByKeyValue).toHaveBeenCalled();
    });

    it('should return 404 if no jobs found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(jobService, 'findAll').mockResolvedValue([]);

      await controller.findAll({} as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job list is empty!' });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.findAll({} as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findAllByCompanyId', () => {
    it('should return jobs for the company', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const jobs = [new Job()];
      const req = { headers: { authorization: 'Bearer testToken' } } as any;
      const decodedToken = { id: 'companyId' };

      jest
        .spyOn(controller['jwtService'], 'decode')
        .mockReturnValue(decodedToken);
      jest.spyOn(jobService, 'findAllByCompanyId').mockResolvedValue(jobs);

      await controller.findAllByCompanyId(req, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(jobs);
    });

    it('should return 404 if no jobs found for the company', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const req = { headers: { authorization: 'Bearer testToken' } } as any;
      const decodedToken = { id: 'companyId' };

      jest
        .spyOn(controller['jwtService'], 'decode')
        .mockReturnValue(decodedToken);
      jest.spyOn(jobService, 'findAllByCompanyId').mockResolvedValue([]);

      await controller.findAllByCompanyId(req, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No job found!' });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const req = { headers: { authorization: 'Bearer testToken' } } as any;

      jest
        .spyOn(controller['jwtService'], 'decode')
        .mockReturnValue({ id: 'companyId' });
      jest
        .spyOn(jobService, 'findAllByCompanyId')
        .mockRejectedValue(new Error('Test error'));

      await controller.findAllByCompanyId(req, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findOne', () => {
    it('should return job by id', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const job = new Job();
      const id = 'valid-uuid';

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(jobService, 'findOneIncludeDeactiveAccount').mockResolvedValue(job);
      jest.spyOn(redisService, 'setObjectByKeyValue').mockResolvedValue(null);

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(job);
      expect(redisService.setObjectByKeyValue).toHaveBeenCalled();
    });

    it('should return 404 if job not found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(jobService, 'findOneIncludeDeactiveAccount').mockResolvedValue(null);

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job not found!' });
    });

    it('should handle errors', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';

      jest
        .spyOn(jobService, 'findOneIncludeDeactiveAccount')
        .mockRejectedValue(new Error('Test error'));

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });

    it('should return 400 for invalid UUID format', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'invalid-uuid';

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const req = { headers: { authorization: 'Bearer testToken' } } as any;
      const decodedToken = { id: 'companyId' };
      const job = new Job();
      const files = {
        images: [{ originalname: 'image.jpg', buffer: Buffer.from('') }],
        internshipPrograme: [
          { originalname: 'program.pdf', buffer: Buffer.from('') },
        ],
      };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(companyService, 'findOne').mockResolvedValue({
        id: 'companyId',
        password: '',
        workField: '',
        address: '',
        website: '',
      } as Company);
      jest
        .spyOn(azureBlobService, 'upload')
        .mockResolvedValue('https://example.com/file');
      jest.spyOn(jobService, 'create').mockResolvedValue(job);
      jest.spyOn(redisService, 'setObjectByKeyValue').mockResolvedValue(null);

      await controller.create(job, req, res as any, files as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({ job });
    });

    it('should handle errors during job creation', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const req = { headers: { authorization: 'Bearer testToken' } } as any;
      const decodedToken = { id: 'companyId' };
      const job = new Job();
      const files = { images: [], internshipPrograme: [] };

      jest
        .spyOn(controller['jwtService'], 'decode')
        .mockReturnValue(decodedToken);
      jest
        .spyOn(controller['companyService'], 'findOne')
        .mockRejectedValue(new Error('Test error'));

      await controller.create(job, req, res as any, files as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';
      const job = new Job();
      const files = {
        images: [{ originalname: 'image.jpg', buffer: Buffer.from('') }],
        internshipPrograme: [
          { originalname: 'program.pdf', buffer: Buffer.from('') },
        ],
      };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest.spyOn(jobService, 'update').mockResolvedValue(job);
      jest
        .spyOn(controller['azureBlobService'], 'upload')
        .mockResolvedValue('https://example.com/file');
      jest.spyOn(redisService, 'setObjectByKeyValue').mockResolvedValue(null);

      await controller.update(id, job, res as any, files as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(JobResponseDto.fromJob(job));
    });

    it('should return 404 if job not found for update', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';
      const job = new Job();
      const files = { images: [], internshipPrograme: [] };

      jest.spyOn(jobService, 'findOne').mockResolvedValue(null);

      await controller.update(id, job, res as any, files as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job not found!' });
    });

    it('should handle errors during job update', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';
      const job = new Job();
      const files = { images: [], internshipPrograme: [] };

      jest
        .spyOn(jobService, 'update')
        .mockRejectedValue(new Error('Test error'));

      await controller.update(id, job, res as any, files as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });

    it('should return 400 if the id is invalid', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'invalid-uuid';
      const job = new Job();
      const files = { images: [], internshipPrograme: [] };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.update(id, job, res as any, files as any);

      (validate as unknown as jest.Mock).mockReturnValue(true);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });
  });

  describe('delete', () => {
    it('should delete a job', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'invalid-uuid';
      const job = new Job();

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.delete(id, res as any);

      (validate as unknown as jest.Mock).mockReturnValue(true);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should delete a job', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';
      const job = new Job();

      jest.spyOn(jobService, 'findOne').mockResolvedValue(job);
      jest.spyOn(jobService, 'delete').mockResolvedValue();
      jest.spyOn(redisService, 'deleteObjectByKey').mockResolvedValue(null);

      await controller.delete(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Job deleted successfully!',
      });
    });

    it('should return 404 if job not found for deletion', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = 'valid-uuid';

      jest.spyOn(jobService, 'findOne').mockResolvedValue(null);

      await controller.delete(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No job found!' });
    });
  });

  describe('findJobsWithCriteria', () => {
    it('should return jobs based on criteria', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const criteria = { title: 'Test' };
      const jobs = [new Job()];

      jest.spyOn(jobService, 'findJobsWithCriteria').mockResolvedValue(jobs);

      await controller.findJobsWithCriteria(criteria, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(JobResponseDto.fromJobArray(jobs));
    });

    it('should return 404 if no jobs found based on criteria', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const criteria = { title: 'Test' };

      jest.spyOn(jobService, 'findJobsWithCriteria').mockResolvedValue([]);

      await controller.findJobsWithCriteria(criteria, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No job found!' });
    });

    it('should handle errors during finding jobs with criteria', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const criteria = { title: 'Test' };

      jest
        .spyOn(jobService, 'findJobsWithCriteria')
        .mockRejectedValue(new Error('Test error'));

      await controller.findJobsWithCriteria(criteria, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });
});
