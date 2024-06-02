import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../../src/app/app.service';
import { CompanyRepository } from '../../../src/module/company/company.repository';
import { JobRepository } from '../../../src/module/job/job.repository';
import { StudentRepository } from '../../../src/module/student/student.repository';

describe('AppService', () => {
  let appService: AppService;
  let companyRepo: CompanyRepository;
  let jobRepo: JobRepository;
  let studentRepo: StudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: CompanyRepository,
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: JobRepository,
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    companyRepo = module.get<CompanyRepository>(CompanyRepository);
    jobRepo = module.get<JobRepository>(JobRepository);
    studentRepo = module.get<StudentRepository>(StudentRepository);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should search', async () => {
    const normalizedKeyword = 'normalizedKeyword';
    const companyResults = [{ updated: '3' }];
    const jobResults = [{ updated: '2' }];
    const studentResults = [{ updated: '1' }];

    const keyword = {
      normalize: jest.fn().mockReturnValue(normalizedKeyword),
    };

    jest.spyOn(keyword, 'normalize');
    jest.spyOn(companyRepo, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(companyResults),
    } as any);
    jest.spyOn(jobRepo, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(jobResults),
    } as any);
    jest.spyOn(studentRepo, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(studentResults),
    } as any);

    const results = await appService.search('keyword');

    expect(results).toEqual([
      ...companyResults,
      ...jobResults,
      ...studentResults,
    ]);
  });
});
