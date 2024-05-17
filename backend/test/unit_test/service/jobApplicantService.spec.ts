import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicants } from 'src/module/jobApplicants/jobApplicants.entity';
import { JobApplicantsRepository } from 'src/module/jobApplicants/jobApplicants.repository';
import { JobApplicantsService } from 'src/module/jobApplicants/jobApplicants.service';

describe('JobApplicantsService', () => {
  let service: JobApplicantsService;
  let repository: JobApplicantsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApplicantsService,
        {
          provide: JobApplicantsRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findJobApplicantsByJobId: jest.fn(),
            findJobApplicantsByCandidateId: jest.fn(),
            findJobApplicantsByJobIdAndCandidateId: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobApplicantsService>(JobApplicantsService);
    repository = module.get<JobApplicantsRepository>(JobApplicantsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new job applicant', async () => {
    const jobApplicant = new JobApplicants();
    const savedJobApplicant = new JobApplicants();
    jest.spyOn(repository, 'create').mockReturnValue(savedJobApplicant);
    jest.spyOn(repository, 'save').mockResolvedValue(savedJobApplicant);

    const result = await service.create(jobApplicant);
    expect(result).toBe(savedJobApplicant);
    expect(repository.create).toHaveBeenCalledWith(jobApplicant);
    expect(repository.save).toHaveBeenCalledWith(savedJobApplicant);
  });

  it('should find a job applicant by id', async () => {
    const jobApplicant = new JobApplicants();
    jest.spyOn(repository, 'findOne').mockResolvedValue(jobApplicant);

    const result = await service.findOne('some-id');
    expect(result).toBe(jobApplicant);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should find all job applicants by job id', async () => {
    const jobApplicants = [new JobApplicants()];
    jest
      .spyOn(repository, 'findJobApplicantsByJobId')
      .mockResolvedValue(jobApplicants);

    const result = await service.findJobApplicantsByJobId('job-id');
    expect(result).toBe(jobApplicants);
    expect(repository.findJobApplicantsByJobId).toHaveBeenCalledWith('job-id');
  });

  it('should find all job applicants by candidate id', async () => {
    const jobApplicants = [new JobApplicants()];
    jest
      .spyOn(repository, 'findJobApplicantsByCandidateId')
      .mockResolvedValue(jobApplicants);

    const result = await service.findJobApplicantsByCandidateId('candidate-id');
    expect(result).toBe(jobApplicants);
    expect(repository.findJobApplicantsByCandidateId).toHaveBeenCalledWith(
      'candidate-id',
    );
  });

  it('should find a job applicant by job id and candidate id', async () => {
    const jobApplicant = new JobApplicants();
    jest
      .spyOn(repository, 'findJobApplicantsByJobIdAndCandidateId')
      .mockResolvedValue(jobApplicant);

    const result = await service.findJobApplicantsByJobIdAndCandidateId(
      'job-id',
      'candidate-id',
    );
    expect(result).toBe(jobApplicant);
    expect(
      repository.findJobApplicantsByJobIdAndCandidateId,
    ).toHaveBeenCalledWith('job-id', 'candidate-id');
  });

  it('should delete a job applicant', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await service.delete('some-id');
    expect(repository.delete).toHaveBeenCalledWith('some-id');
  });

  it('should update a job applicant', async () => {
    const jobApplicant = new JobApplicants();
    const updatedJobApplicant = new JobApplicants();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedJobApplicant);

    const result = await service.update('some-id', jobApplicant);
    expect(result).toBe(updatedJobApplicant);
    expect(repository.update).toHaveBeenCalledWith('some-id', jobApplicant);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });
});
