import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/module/auth/auth.service';
import { RedisService } from 'src/module/redis/redis.service';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import * as bcrypt from 'bcrypt';
import { HttpStatus, Response } from '@nestjs/common';
import { CompanyController } from 'src/module/company/company.controller';
import { StaffService } from 'src/module/staff/staff.service';
import { StudentService } from 'src/module/student/student.service';
import { CompanyService } from 'src/module/company/company.service';
import { Company } from 'src/module/company/company.entity';
import { CompanyResponseDto } from 'src/module/company/dto/companyResponse.dto';
import validate = require('uuid-validate');
import { CompanyUpdateDto } from 'src/module/company/dto/companyUpdate.dto';
import { CompanyRepository } from 'src/module/company/company.repository';

jest.mock('uuid-validate');
jest.mock('bcrypt');
jest.mock('@nestjs/jwt');
jest.mock('src/module/company/company.service');
jest.mock('src/module/staff/staff.service');
jest.mock('src/module/auth/auth.service');
jest.mock('src/module/student/student.service');
jest.mock('src/module/redis/redis.service');
jest.mock('src/common/service/azureBlob.service');
jest.mock('src/module/company/company.repository');

describe('CompanyController', () => {
  let controller: CompanyController;
  let jwtService: JwtService;
  let authService: AuthService;
  let staffService: StaffService;
  let redisService: RedisService;
  let studentService: StudentService;
  let companyService: CompanyService;
  let azureBlobService: AzureBlobService;
  let companyRepository: CompanyRepository;

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
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockAzureBlobService: Partial<AzureBlobService> = {
      upload: jest.fn(),
      delete: jest.fn(),
    };
    const mockCompanyRepository: Partial<CompanyRepository> = {
      find: jest.fn(),
      findOne: jest.fn(),
      createCompany: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    jwtService = mockJwtService as JwtService;
    authService = mockAuthService as AuthService;
    staffService = mockStaffService as StaffService;
    redisService = mockRedisService as RedisService;
    studentService = mockStudentService as StudentService;
    companyService = mockCompanyService as CompanyService;
    azureBlobService = mockAzureBlobService as AzureBlobService;
    companyRepository = mockCompanyRepository as CompanyRepository;
    controller = new CompanyController(
      jwtService,
      authService,
      redisService,
      staffService,
      studentService,
      companyService,
      azureBlobService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyProfile', () => {
    it('should return the profile of the company', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: 'company-id' };
      const cachedData = null;
      const company = new Company();
      const companyResponse = CompanyResponseDto.fromCompany(company);

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(company);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.getMyProfile(req, res as any);

      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(redisService.getObjectByKey).toHaveBeenCalledWith(
        `COMPANY:${decodedToken.id}`,
      );
      expect(companyService.findOne).toHaveBeenCalledWith(decodedToken.id);
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `COMPANY:${decodedToken.id}`,
        companyResponse,
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponse);
    });

    it('should return the profile of the company from cache', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: 'company-id' };
      const company = new Company();
      const companyResponse = CompanyResponseDto.fromCompany(company);

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(company);

      await controller.getMyProfile(req, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponse);
    });

    it('should return 404 if company not found', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: 'company-id' };
      const cachedData = null;

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(null);

      await controller.getMyProfile(req, res as any);

      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(redisService.getObjectByKey).toHaveBeenCalledWith(
        `COMPANY:${decodedToken.id}`,
      );
      expect(companyService.findOne).toHaveBeenCalledWith(decodedToken.id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Company not found!' });
    });

    it('should handle errors', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: 'company-id' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.getMyProfile(req, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const cachedData = null;
      const companies = [new Company(), new Company()];
      const companyResponses = CompanyResponseDto.fromCompanyArray(companies);

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findAll').mockResolvedValue(companies);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.findAll(req as any, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith('COMPANYLIST');
      expect(companyService.findAll).toHaveBeenCalled();
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        'COMPANYLIST',
        companyResponses,
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponses);
    });

    it('should return companies from cache', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const companies = [new Company(), new Company()];
      const companyResponses = CompanyResponseDto.fromCompanyArray(companies);

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(companies);

      await controller.findAll(req as any, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith('COMPANYLIST');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponses);
    });

    it('should return 404 if no companies found', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const cachedData = null;

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findAll').mockResolvedValue([]);

      await controller.findAll(req as any, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith('COMPANYLIST');
      expect(companyService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Company list is empty!',
      });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.findAll(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      const id = 'valid-uuid';
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const cachedData = null;
      const company = new Company();
      const companyResponse = CompanyResponseDto.fromCompany(company);

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(company);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.findOne(id, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith(`COMPANY:${id}`);
      expect(companyService.findOne).toHaveBeenCalledWith(id);
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `COMPANY:${id}`,
        companyResponse,
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponse);
    });

    it('should return a company from cache', async () => {
      const id = 'valid-uuid';
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const company = new Company();
      const companyResponse = CompanyResponseDto.fromCompany(company);

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(company);

      await controller.findOne(id, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith(`COMPANY:${id}`);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponse);
    });

    it('should return 404 if company not found', async () => {
      const id = 'valid-uuid';
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const cachedData = null;

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(cachedData);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(null);

      await controller.findOne(id, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith(`COMPANY:${id}`);
      expect(companyService.findOne).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Company not found!' });
    });

    it('should return 400 for invalid UUID', async () => {
      const id = 'invalid-uuid';
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });

    it('should handle errors', async () => {
      const id = 'valid-uuid';
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.findOne(id, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('create', () => {
    it('should create a new company and return the company along with a JWT token', async () => {
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      const companyData = {
        email: 'test@example.com',
        password: 'test-password',
      } as Company;

      const hashedPassword = 'hashed-password';
      const newCompany = new Company();
      const savedCompany = { ...newCompany, id: 'company-id' };
      const companyResponse = CompanyResponseDto.fromCompany(savedCompany);
      const jwtToken = 'jwt-token';

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(azureBlobService, 'upload').mockResolvedValue('avatar-url');
      jest.spyOn(companyService, 'create').mockResolvedValue(savedCompany);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue(jwtToken);

      await controller.create(file, companyData, res as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'test-password',
        parseInt(process.env.BCRYPT_SALT),
      );
      expect(staffService.findByEmail).toHaveBeenCalledWith(companyData.email);
      expect(studentService.findByEmail).toHaveBeenCalledWith(
        companyData.email,
      );
      expect(companyService.findByEmail).toHaveBeenCalledWith(
        companyData.email,
      );
      expect(azureBlobService.upload).toHaveBeenCalledWith(file);
      expect(companyService.create).toHaveBeenCalledWith({
        ...companyData,
        password: hashedPassword,
        avatar: 'avatar-url',
      });
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `COMPANY:${savedCompany.id}`,
        companyResponse,
        expect.any(Number),
      );
      expect(authService.generateJwtToken).toHaveBeenCalledWith(savedCompany);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        company: companyResponse,
        token: jwtToken,
      });
    });

    it('should return conflict if email already exists', async () => {
      const file = null;
      const companyData = {
        email: 'test@example.com',
        password: 'test-password',
      } as Company;

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue({} as any);

      await controller.create(file, companyData, res as any);

      expect(staffService.findByEmail).toHaveBeenCalledWith(companyData.email);
      expect(studentService.findByEmail).not.toHaveBeenCalled();
      expect(companyService.findByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists!',
      });
    });

    it('should handle errors', async () => {
      const file = null;
      const companyData = {
        email: 'test@example.com',
        password: 'test-password',
      } as Company;

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.create(file, companyData, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('update', () => {
    it('should update an existing company', async () => {
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      const companyUpdateData = {
        password: 'current-password',
        newPassword: 'new-password',
      } as CompanyUpdateDto;

      const companyId = 'company-id';
      const existingCompany = new Company();
      existingCompany.password = 'hashed-current-password';
      existingCompany.avatar = 'old-avatar-url';

      const hashedNewPassword = 'hashed-new-password';
      const updatedCompany = {
        ...existingCompany,
        ...companyUpdateData,
        password: hashedNewPassword,
      };
      const companyResponse = CompanyResponseDto.fromCompany(updatedCompany);

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: companyId };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(existingCompany);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedNewPassword as never);
      jest
        .spyOn(azureBlobService, 'upload')
        .mockResolvedValue('new-avatar-url');
      jest.spyOn(azureBlobService, 'delete').mockResolvedValue(undefined);
      jest.spyOn(companyService, 'update').mockResolvedValue(updatedCompany);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.update(
        file,
        companyId,
        companyUpdateData,
        req as any,
        res as any,
      );

      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(companyService.findOne).toHaveBeenCalledWith(companyId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'current-password',
        existingCompany.password,
      );
      expect(azureBlobService.upload).toHaveBeenCalledWith(file);
      expect(azureBlobService.delete).toHaveBeenCalledWith('old-avatar-url');
      expect(companyService.update).toHaveBeenCalledWith(companyId, {
        ...companyUpdateData,
        password: hashedNewPassword,
        avatar: 'new-avatar-url',
      });
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `COMPANY:${companyId}`,
        companyResponse,
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(companyResponse);
    });

    it('should return unauthorized if credentials are invalid', async () => {
      const file = null;
      const companyUpdateData = {
        password: 'current-password',
        newPassword: 'new-password',
      } as CompanyUpdateDto;

      const companyId = 'company-id';
      const existingCompany = new Company();
      existingCompany.password = 'hashed-current-password';

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: 'another-company-id' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(existingCompany);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await controller.update(
        file,
        companyId,
        companyUpdateData,
        req as any,
        res as any,
      );

      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(companyService.findOne).toHaveBeenCalledWith(companyId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        companyUpdateData.password,
        existingCompany.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 404 if company not found', async () => {
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from('test-buffer'),
      } as Express.Multer.File;

      const companyUpdateData = {
        password: 'current-password',
        newPassword: 'new-password',
      } as CompanyUpdateDto;

      const companyId = 'company-id';
      const existingCompany = new Company();
      existingCompany.password = 'hashed-current-password';
      existingCompany.avatar = 'old-avatar-url';

      const hashedNewPassword = 'hashed-new-password';
      const updatedCompany = {
        ...existingCompany,
        ...companyUpdateData,
        password: hashedNewPassword,
      };
      const companyResponse = CompanyResponseDto.fromCompany(updatedCompany);

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const decodedToken = { id: companyId };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(existingCompany);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedNewPassword as never);
      jest
        .spyOn(azureBlobService, 'upload')
        .mockResolvedValue('new-avatar-url');
      jest.spyOn(azureBlobService, 'delete').mockResolvedValue(undefined);
      jest.spyOn(companyService, 'update').mockResolvedValue(null);

      await controller.update(
        file,
        companyId,
        companyUpdateData,
        req as any,
        res as any,
      );

      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(companyService.findOne).toHaveBeenCalledWith(companyId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Company not found!' });
    });

    it('should handle errors', async () => {
      const file = null;
      const companyUpdateData = {
        password: 'current-password',
        newPassword: 'new-password',
      } as CompanyUpdateDto;

      const companyId = 'company-id';

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: companyId });
      jest
        .spyOn(companyService, 'findOne')
        .mockRejectedValue(new Error('Test error'));

      await controller.update(
        file,
        companyId,
        companyUpdateData,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });

    it('should throw 400 BAD REQUEST if id is invalid', async () => {
      const file = null;
      const companyUpdateData = {
        password: 'current-password',
        newPassword: 'new-password',
      } as CompanyUpdateDto;

      const companyId = 'company-id';

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.update(
        file,
        companyId,
        companyUpdateData,
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid UUID format' });
    });
  });

  describe('delete', () => {
    it('should delete an existing company', async () => {
      const companyId = 'company-id';
      const company = new Company();
      company.avatar = 'avatar-url';

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(true);
      jest.spyOn(companyService, 'findOne').mockResolvedValue(company);
      jest.spyOn(companyService, 'delete').mockResolvedValue(undefined);
      jest
        .spyOn(redisService, 'deleteObjectByKey')
        .mockResolvedValue(undefined);
      jest.spyOn(azureBlobService, 'delete').mockResolvedValue(undefined);

      await controller.delete(companyId, res as any);

      expect(companyService.findOne).toHaveBeenCalledWith(companyId);
      expect(companyService.delete).toHaveBeenCalledWith(companyId);
      expect(redisService.deleteObjectByKey).toHaveBeenCalledWith(
        `COMPANY:${companyId}`,
      );
      expect(azureBlobService.delete).toHaveBeenCalledWith('avatar-url');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Company deleted successfully!',
      });
    });

    it('should return 404 if company not found', async () => {
      const companyId = 'company-id';

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(companyService, 'findOne').mockResolvedValue(null);

      await controller.delete(companyId, res as any);

      expect(companyService.findOne).toHaveBeenCalledWith(companyId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No company found!' });
    });

    it('should return 400 for invalid UUID format', async () => {
      const invalidCompanyId = 'invalid-uuid';

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (validate as unknown as jest.Mock).mockReturnValue(false);

      await controller.delete(invalidCompanyId, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid UUID format',
      });
    });
  });

  describe('login', () => {
    it('should login a company and return a token', async () => {
      const req = {
        headers: {
          authorization: 'Bearer existing-token',
        },
      };
      const loginData = { email: 'test@company.com', password: 'password' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const company = new Company();
      company.email = 'test@company.com';
      company.password = await bcrypt.hash('password', 10);

      jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);
      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(company);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('new-token');
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.login(req as any, loginData, res as any);

      expect(companyService.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        company.password,
      );
      expect(authService.generateJwtToken).toHaveBeenCalledWith(company);
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `AUTH:new-token`,
        'new-token',
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: 'new-token' });
    });

    it('should return 401 for invalid credentials', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const loginData = {
        email: 'test@company.com',
        password: 'wrong-password',
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const company = new Company();
      company.email = 'test@company.com';
      company.password = await bcrypt.hash('password', 10);

      jest.spyOn(companyService, 'findByEmail').mockResolvedValue(company);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await controller.login(req as any, loginData, res as any);

      expect(companyService.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        company.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return token from cache if already authenticated', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const loginData = { email: 'test@company.com', password: 'password' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockResolvedValue('cached-token');

      await controller.login(req as any, loginData, res as any);

      expect(redisService.getObjectByKey).toHaveBeenCalledWith(`AUTH:token`);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: 'cached-token' });
    });

    it('should handle errors', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const loginData = { email: 'test@company.com', password: 'password' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'getObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.login(req as any, loginData, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });

  describe('logout', () => {
    it('should logout a company and delete the token', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'deleteObjectByKey')
        .mockResolvedValue(undefined);
      jest
        .spyOn(redisService, 'setObjectByKeyValue')
        .mockResolvedValue(undefined);

      await controller.logout(req as any, res as any);

      expect(redisService.deleteObjectByKey).toHaveBeenCalledWith(`AUTH:token`);
      expect(redisService.setObjectByKeyValue).toHaveBeenCalledWith(
        `BLACKLIST:token`,
        'token',
        expect.any(Number),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successfully!',
      });
    });

    it('should handle errors', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest
        .spyOn(redisService, 'deleteObjectByKey')
        .mockRejectedValue(new Error('Test error'));

      await controller.logout(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
  });
});
