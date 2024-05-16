import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { AuthService } from 'src/module/auth/auth.service';
import { CompanyService } from 'src/module/company/company.service';
import { Faculty } from 'src/module/faculty/faculty.entity';
import { RedisService } from 'src/module/redis/redis.service';
import { StaffService } from 'src/module/staff/staff.service';
import { StudentUpdateDto } from 'src/module/student/dto/studentUpdate.dto';
import { StudentController } from 'src/module/student/student.controller';
import { Student } from 'src/module/student/student.entity';
import { StudentService } from 'src/module/student/student.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import validate = require('uuid-validate');

jest.mock('uuid-validate');
describe('StudentController', () => {
  let studentController: StudentController;
  let jwtService: JwtService;
  let authService: AuthService;
  let staffService: StaffService;
  let redisService: RedisService;
  let studentService: StudentService;
  let companyService: CompanyService;
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

  const faculty: Faculty = {
    id: '',
    name: 'Engineering',
    avatar: 'avatar',
    created: new Date(),
    updated: new Date(),
  };

  const student: Student = {
    id: '1',
    name: 'John Doe',
    faculty: faculty,
    isVerify: false,
    studentId: 123456,
    gpa: 3.5,
    year: 2021,
    major: 'Computer Science',
    classCode: 'CS123',
    resume: [],
    isActive: true,
    process: 'pending',
    socialMedia: {
      github: 'github',
      linkedin: 'linkedin',
      google: 'google',
      facebook: 'facebook',
      twitter: 'twitter',
    },
    objective: 'objective',
    education: [],
    workingHistory: [],
    certificate: [],
    skill: [],
    additionalInformation: [],
    reference: [],
    email: '',
    phoneNumber: '',
    avatar: '',
    role: '',
    created: undefined,
    updated: undefined,
  };

  const studentUpdateDto: StudentUpdateDto = {
    name: 'John Doe',
    email: 'test@gmail.com',
    phoneNumber: '123456789',
    avatar: 'avatar',
    studentId: 123456,
    isVerify: false,
    isActive: true,
    deleteResumeID: ['deleteResumeID'],
    resume: [
      { id: '1', title: 'title1', url: 'resumeUrl1' },
      { id: '2', title: 'title2', url: 'resumeUrl2' },
    ],
    resumeObjective: 'objective',
  };

  beforeEach(() => {
    const mockJwtService: Partial<JwtService> = {
      sign: jest.fn(),
      decode: jest.fn(),
    };
    const mockAuthService: Partial<AuthService> = {
      generateJwtToken: jest.fn(),
    };
    const mockStaffService: Partial<StaffService> = { findByEmail: jest.fn() };
    const mockRedisService: Partial<RedisService> = {
      getObjectByKey: jest.fn(),
      setObjectByKeyValue: jest.fn(),
      deleteObjectByKey: jest.fn(),
    };
    const mockStudentService: Partial<StudentService> = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockCompanyService: Partial<CompanyService> = {
      findByEmail: jest.fn(),
    };
    const mockAzureBlobService: Partial<AzureBlobService> = {
      upload: jest.fn(),
      delete: jest.fn(),
    };

    jwtService = mockJwtService as JwtService;
    authService = mockAuthService as AuthService;
    staffService = mockStaffService as StaffService;
    redisService = mockRedisService as RedisService;
    studentService = mockStudentService as StudentService;
    companyService = mockCompanyService as CompanyService;
    azureBlobService = mockAzureBlobService as AzureBlobService;
    studentController = new StudentController(
      jwtService,
      authService,
      staffService,
      redisService,
      studentService,
      companyService,
      azureBlobService,
    );
  });

  describe('getMyProfile', () => {
    it('should return a student profile in cache data', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(student);

      await studentController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(student);
    });

    it('should return a student profile in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(student);

      await studentController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(student);
    });

    it('should return an error when there is no student in the database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);

      await studentController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found!' });
    });

    it('should throw error when fetch a student profile in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest
        .spyOn(studentService, 'findOne')
        .mockImplementation(async (id: string) => {
          throw new Error('error');
        });

      await studentController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('findAll', () => {
    it('should return a list of students in cache', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue([student]);

      await studentController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([student]);
    });

    it('should return a list of students in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findAll').mockResolvedValue([student]);

      await studentController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([student]);
    });

    it('should throw error with unexpected error with findAll', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findAll').mockImplementation(async () => {
        throw new Error('error');
      });

      await studentController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });

    it('should throw 404 error when no student in the list', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findAll').mockResolvedValue([]);

      await studentController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Student list is empty!',
      });
    });
  });

  describe('findOne', () => {
    it('should return a student by id in cache', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue([student]);

      await studentController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([student]);
    });

    it('should throw 400 error if the id is invalid', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await studentController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should return a student by id in database', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(student);

      await studentController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(student);
    });

    it('should throw 404 NOT FOUND if there is no student match', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);

      await studentController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found!' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest
        .spyOn(studentService, 'findOne')
        .mockImplementation(async (id: string) => {
          throw new Error('error');
        });

      await studentController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('create', () => {
    it('should create new student successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(studentService, 'create').mockResolvedValue(student);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('token');

      await studentController.create(file, student, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        student: student,
        token: 'token',
      });
    });

    it('should throw 400 BAD REQUEST if the student is already registered', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(student);

      await studentController.create(file, student, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists!',
      });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(studentService, 'create').mockImplementation(async () => {
        throw new Error('error');
      });

      await studentController.create(file, student, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('update', () => {
    it('should throw 400 error if the id is invalid', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await studentController.update(
        { avatar: [file], resume: [file] },
        '1',
        studentUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if detect unexpected field', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);

      await studentController.update(
        { avatar: [file], resume: [file] },
        '1',
        studentUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: `Cannot read properties of undefined (reading 'avatar')`,
      });
    });

    it('should update student information successfully', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);

      jest.spyOn(studentService, 'findOne').mockResolvedValue(student);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(studentService, 'update').mockResolvedValue(student);

      await studentController.update(
        { avatar: [file], resume: [file] },
        '1',
        studentUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(student);
    });
  });

  describe('delete', () => {
    it('should delete student successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(studentService, 'findOne').mockResolvedValue(student);
      jest.spyOn(studentService, 'delete').mockResolvedValue(undefined);

      await studentController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Student deleted successfully!',
      });
    });

    it('should throw 404 NOT FOUND if the student is not found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);

      await studentController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No student found!' });
    });

    it('should throw 400 BAD REQUEST if the id is invalid', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await studentController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(student);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('token');

      await studentController.login(
        req as any,
        { email: student.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should login successfully when cache data available', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockResolvedValue('cacheToken');

      await studentController.login(
        req as any,
        { email: student.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: 'cacheToken' });
    });

    it('should throw 401 UNAUTHORIZED if the student is not found', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);

      await studentController.login(
        req as any,
        { email: student.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(studentService, 'findByEmail').mockImplementation(async () => {
        throw new Error('error');
      });

      await studentController.login(
        req as any,
        { email: student.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'deleteObjectByKey')
        .mockResolvedValue(undefined);

      await studentController.logout(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successfully!',
      });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'deleteObjectByKey')
        .mockImplementation(async () => {
          throw new Error('error');
        });

      await studentController.logout(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });
});
