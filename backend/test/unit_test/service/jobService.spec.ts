import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'src/module/job/job.entity';
import { JobRepository } from 'src/module/job/job.repository';
import { JobService } from 'src/module/job/job.service';

describe('JobService', () => {
  let service: JobService;
  let repository: JobRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: JobRepository,
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([new Job()]),
              getOne: jest.fn().mockResolvedValue(new Job()),
            })),
            findJobsWithCriteria: jest.fn().mockResolvedValue([new Job()]),
            create: jest.fn().mockReturnValue(new Job()),
            save: jest.fn().mockResolvedValue(new Job()),
            update: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue(new Job()),
            delete: jest.fn().mockResolvedValue(undefined),
            findAllJobByCompanyId: jest.fn().mockResolvedValue([new Job()]),
          },
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    repository = module.get<JobRepository>(JobRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all jobs', async () => {
    const jobs = [new Job()];
    const queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(jobs),
    };
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue(queryBuilderMock as any);
    const result = await service.findAll();
    expect(result).toBe(jobs);
    expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalled();
    expect(queryBuilderMock.select).toHaveBeenCalled();
    expect(queryBuilderMock.where).toHaveBeenCalledWith(
      'company.isActive = :isActive',
      { isActive: true },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'company.isVerify = :isVerify',
      { isVerify: true },
    );
    expect(queryBuilderMock.getMany).toHaveBeenCalled();
  });

  it('should find one job by id', async () => {
    const job = new Job();
    const queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(job),
    };
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue(queryBuilderMock as any);
    const result = await service.findOne('some-id');
    expect(result).toBe(job);
    expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalled();
    expect(queryBuilderMock.select).toHaveBeenCalled();
    expect(queryBuilderMock.where).toHaveBeenCalledWith('job.id = :id', {
      id: 'some-id',
    });
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'company.isActive = :isActive',
      { isActive: true },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'company.isVerify = :isVerify',
      { isVerify: true },
    );
    expect(queryBuilderMock.getOne).toHaveBeenCalled();
  });

  it('should find jobs with criteria', async () => {
    const jobs = [new Job()];
    jest.spyOn(repository, 'findJobsWithCriteria').mockResolvedValue(jobs);
    const result = await service.findJobsWithCriteria({ title: 'Developer' });
    expect(result).toBe(jobs);
    expect(repository.findJobsWithCriteria).toHaveBeenCalledWith({
      title: 'Developer',
    });
  });

  it('should create a new job', async () => {
    const job = new Job();
    const newJob = new Job();
    jest.spyOn(repository, 'create').mockReturnValue(newJob);
    jest.spyOn(repository, 'save').mockResolvedValue(newJob);
    const result = await service.create(job);
    expect(result).toBe(newJob);
    expect(repository.create).toHaveBeenCalledWith(job);
    expect(repository.save).toHaveBeenCalledWith(newJob);
  });

  it('should update a job', async () => {
    const job = new Job();
    const updatedJob = new Job();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedJob);
    const result = await service.update('some-id', job);
    expect(result).toBe(updatedJob);
    expect(repository.update).toHaveBeenCalledWith('some-id', job);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should delete a job', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await service.delete('some-id');
    expect(repository.delete).toHaveBeenCalledWith({ id: 'some-id' });
  });

  it('should find a job by title', async () => {
    const job = new Job();
    jest.spyOn(repository, 'findOne').mockResolvedValue(job);
    const result = await service.findJobByTitle('Developer');
    expect(result).toBe(job);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { title: 'Developer' },
    });
  });

  it('should find all jobs by company id', async () => {
    const jobs = [new Job()];
    jest.spyOn(repository, 'findAllJobByCompanyId').mockResolvedValue(jobs);
    const result = await service.findAllByCompanyId('company-id');
    expect(result).toBe(jobs);
    expect(repository.findAllJobByCompanyId).toHaveBeenCalledWith('company-id');
  });
});
