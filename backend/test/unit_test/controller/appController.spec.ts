import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app/app.controller';
import { AppService } from '../../../src/app/app.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { StudentRepository } from 'src/module/student/student.repository';
import { JobRepository } from 'src/module/job/job.repository';
import { CompanyRepository } from 'src/module/company/company.repository';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: StudentRepository,
          useValue: {
            // mock methods if needed
          },
        },
        {
          provide: JobRepository,
          useValue: {
            // mock methods if needed
          },
        },
        {
          provide: CompanyRepository,
          useValue: {},
        },
        JwtGuard,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {},
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should search', async () => {
    const search = 'search';
    const searchResult = [{ updated: '3' }];

    jest.spyOn(appService, 'search').mockResolvedValue(searchResult);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.spyOn(response, 'status');
    jest.spyOn(response, 'json');

    await appController.search({} as any, response as any, search);

    expect(appService.search).toHaveBeenCalledWith(search);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(searchResult);
  });

  it('should return error', async () => {
    const search = 'search';
    const error = new Error('error');

    jest.spyOn(appService, 'search').mockRejectedValue(error);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.spyOn(response, 'status');
    jest.spyOn(response, 'json');

    await appController.search({} as any, response as any, search);

    expect(appService.search).toHaveBeenCalledWith(search);
    expect(response.json).toHaveBeenCalledWith({ message: error.message });
  });
});
