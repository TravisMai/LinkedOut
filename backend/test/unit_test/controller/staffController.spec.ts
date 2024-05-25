import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { AuthService } from 'src/module/auth/auth.service';
import { CompanyService } from 'src/module/company/company.service';
import { Faculty } from 'src/module/faculty/faculty.entity';
import { RedisService } from 'src/module/redis/redis.service';
import { StaffResponseDto } from 'src/module/staff/dto/staffResponse.dto';
import { StaffUpdateDto } from 'src/module/staff/dto/staffUpdate.dto';
import { StaffController } from 'src/module/staff/staff.controller';
import { Staff } from 'src/module/staff/staff.entity';
import { StaffService } from 'src/module/staff/staff.service';
import { StudentService } from 'src/module/student/student.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import validate = require('uuid-validate');

jest.mock('uuid-validate');
describe('StaffController', () => {
  let staffController: StaffController;
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

  const staffResponseDto: StaffResponseDto = {
    id: '1',
    name: 'John Doe',
    email: '',
    phoneNumber: '',
    avatar: '',
    isAdmin: false,
    staffId: 0,
  };

  const staffResponseDtoConverted = {
    id: '1',
    name: 'John Doe',
    email: '',
    phoneNumber: '',
    avatar: '',
    isAdmin: false,
    staffId: 0,
  };

  const staffUpdateDto: StaffUpdateDto = {
    name: 'John Doe',
    email: '',
    phoneNumber: '',
    avatar: '',
    isAdmin: false,
    staffId: 0,
  };

  beforeEach(() => {
    const mockJwtService: Partial<JwtService> = {
      sign: jest.fn(),
      decode: jest.fn(),
    };
    const mockAuthService: Partial<AuthService> = {
      generateJwtToken: jest.fn(),
    };
    const mockStaffService: Partial<StaffService> = {
      findByEmail: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
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
    staffController = new StaffController(
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
    it('should return a staff profile in cache data', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(staff);

      await staffController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(staff);
    });

    it('should return a staff profile in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);

      await staffController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(staffResponseDto);
    });

    it('should return an error when there is no staff in the database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(null);

      await staffController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found!' });
    });

    it('should throw error when fetch a staff profile in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest
        .spyOn(staffService, 'findOne')
        .mockImplementation(async (id: string) => {
          throw new Error('error');
        });

      await staffController.getMyProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('findAll', () => {
    it('should return a list of staffs in cache', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue([staff]);

      await staffController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([staff]);
    });

    it('should return a list of staffs in database', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findAll').mockResolvedValue([staff]);

      await staffController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([staffResponseDto]);
    });

    it('should throw error with unexpected error with findAll', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findAll').mockImplementation(async () => {
        throw new Error('error');
      });

      await staffController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });

    it('should throw 404 error when no staff in the list', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findAll').mockResolvedValue([]);

      await staffController.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Staff list is empty!',
      });
    });
  });

  describe('findOne', () => {
    it('should return a staff by id in cache', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue([staff]);

      await staffController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([staff]);
    });

    it('should throw 400 error if the id is invalid', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await staffController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should return a staff by id in database', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);

      await staffController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(staffResponseDto);
    });

    it('should throw 404 NOT FOUND if there is no staff match', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(null);

      await staffController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found!' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest
        .spyOn(staffService, 'findOne')
        .mockImplementation(async (id: string) => {
          throw new Error('error');
        });

      await staffController.findOne(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });

  describe('create', () => {
    it('should create new staff successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(staffService, 'create').mockResolvedValue(staff);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('token');

      await staffController.create(file, staff, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should throw 400 BAD REQUEST if the staff is already registered', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(staff);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);

      await staffController.create(file, staff, res as any);

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
      jest.spyOn(staffService, 'create').mockImplementation(async () => {
        throw new Error('error');
      });

      await staffController.create(file, staff, res as any);

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
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await staffController.update(
        '1',
        file,
        staffUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should throw 403 UNAUTHORIZED when id not match', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '2' });

      await staffController.update(
        '1',
        file,
        staffUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should throw 404 NOT FOUND when no staff found', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(staffService, 'update').mockResolvedValue(null);

      await staffController.update(
        '1',
        file,
        staffUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found!' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      (validate as unknown as jest.Mock).mockReturnValue(true);

      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(staffService, 'update').mockResolvedValue(staff);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockImplementation(async (key: string, value: any, ttl: number) => {
          throw new Error('error');
        });

      await staffController.update(
        '1',
        file,
        staffUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: `Cannot read properties of undefined (reading 'id')`,
      });
    });

    it('should update staff information successfully', async () => {
      const req = {
        params: { id: '1' },
        headers: { authorization: 'Bearer token' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      (validate as unknown as jest.Mock).mockReturnValue(true);

      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar');
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: '1' });
      jest.spyOn(staffService, 'update').mockResolvedValue(staff);

      await staffController.update(
        '1',
        file,
        staffUpdateDto,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('delete', () => {
    it('should delete staff successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
      jest.spyOn(staffService, 'delete').mockResolvedValue(undefined);

      await staffController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Staff deleted successfully!',
      });
    });

    it('should throw 404 NOT FOUND if the staff is not found', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findOne').mockResolvedValue(null);

      await staffController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No staff found!' });
    });

    it('should throw 400 BAD REQUEST if the id is invalid', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await staffController.delete('1', res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(staff);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('token');

      await staffController.login(
        req as any,
        { email: staff.email },
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

      await staffController.login(
        req as any,
        { email: staff.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: 'cacheToken' });
    });

    it('should throw 401 UNAUTHORIZED if the staff is not found', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);

      await staffController.login(
        req as any,
        { email: staff.email },
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should throw 500 INTERNAL SERVER ERROR if there is an unexpected error', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockImplementation(async () => {
        throw new Error('error');
      });

      await staffController.login(
        req as any,
        { email: staff.email },
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

      await staffController.logout(req as any, res as any);

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

      await staffController.logout(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'error' });
    });
  });
});
