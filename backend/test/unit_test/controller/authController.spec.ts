import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/module/auth/auth.controller';
import { AuthService } from '../../../src/module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../../../src/module/staff/staff.service';
import { StudentService } from '../../../src/module/student/student.service';
import {
  LoginTicket,
  OAuth2Client,
  TokenPayload,
} from 'google-auth-library';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { StudentResponseDto } from '../../../src/module/student/dto/studentResponse.dto';
import { Student } from 'src/module/student/student.entity';
import { Staff } from 'src/module/staff/staff.entity';
import { StaffResponseDto } from 'src/module/staff/dto/staffResponse.dto';

jest.mock('google-auth-library');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let staffService: StaffService;
  let studentService: StudentService;
  let oAuth2ClientMock: Partial<OAuth2Client>;

  beforeEach(async () => {
    oAuth2ClientMock = {
      verifyIdToken: jest.fn() as jest.Mock<Promise<LoginTicket>>,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJwtToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: StaffService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: StudentService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    staffService = module.get<StaffService>(StaffService);
    studentService = module.get<StudentService>(StudentService);

    authController['client'] = oAuth2ClientMock as OAuth2Client;
  });

  describe('checkRole', () => {
    it('should return true if the role matches the token payload', async () => {
      const role = 'student';
      const jwtToken = 'jwt-token';
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'student' });

      await authController.checkRole(role, jwtToken, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({ isMatch: true });
    });

    it('should return false if the role does not match the token payload', async () => {
      const role = 'student';
      const jwtToken = 'jwt-token';
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'staff' });

      await authController.checkRole(role, jwtToken, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({ isMatch: false });
    });

    it('should return 403 if token verification fails', async () => {
      const role = 'student';
      const jwtToken = 'invalid-jwt-token';
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Unauthorized access');
      });

      await authController.checkRole(role, jwtToken, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'Unauthorized access',
      });
    });
  });

  describe('login', () => {
    it('should return student and token if role is student', async () => {
      const token = 'test-token';
      const role = 'student';
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const payload = {
        email: 'student@example.com',
      };
      const student = new Student();
      const limitedData = new StudentResponseDto();

      const mockPayload: TokenPayload = {
        iss: 'issuer',
        sub: 'subject',
        aud: 'audience',
        iat: 1234567890,
        exp: 1234567890,
        email: 'student@example.com',
      };

      const mockGetPayloadFromToken = jest.spyOn(
        AuthController.prototype,
        'getPayloadFromToken',
      );
      mockGetPayloadFromToken.mockResolvedValue(mockPayload);

      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(student);
      jest
        .spyOn(StudentResponseDto, 'fromStudent')
        .mockReturnValue(limitedData);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('jwt-token');

      const authController = new AuthController(
        jwtService,
        authService,
        staffService,
        studentService,
      );

      await authController.login(token, role, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({
        student: limitedData,
        token: 'jwt-token',
      });
    });

    it('should return staff and token if role is staff', async () => {
      const token = 'test-token';
      const role = 'staff';
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const payload = {
        email: 'staff@example.com',
      };
      const staff = new Staff();
      const limitedData = new StaffResponseDto();

      const mockPayload: TokenPayload = {
        iss: 'issuer',
        sub: 'subject',
        aud: 'audience',
        iat: 1234567890,
        exp: 1234567890,
        email: 'staff@example.com',
      };

      const mockGetPayloadFromToken = jest.spyOn(
        AuthController.prototype,
        'getPayloadFromToken',
      );
      mockGetPayloadFromToken.mockResolvedValue(mockPayload);

      jest.spyOn(staffService, 'findByEmail').mockResolvedValue(staff);
      jest
        .spyOn(StaffResponseDto, 'fromStaff')
        .mockReturnValue(limitedData);
      jest.spyOn(authService, 'generateJwtToken').mockReturnValue('jwt-token');

      const authController = new AuthController(
        jwtService,
        authService,
        staffService,
        studentService,
      );

      await authController.login(token, role, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({
        staff: limitedData,
        token: 'jwt-token',
      });
    });
  });
});
