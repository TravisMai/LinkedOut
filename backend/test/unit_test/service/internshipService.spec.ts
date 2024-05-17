import { Test, TestingModule } from '@nestjs/testing';
import { Internship } from 'src/module/internship/internship.entity';
import { InternshipRepository } from 'src/module/internship/internship.repository';
import { InternshipService } from 'src/module/internship/internship.service';

describe('InternshipService', () => {
  let service: InternshipService;
  let repository: InternshipRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternshipService,
        {
          provide: InternshipRepository,
          useValue: {
            create: jest.fn().mockReturnValue(new Internship()),
            save: jest.fn().mockResolvedValue(new Internship()),
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            findInternshipsByCompanyId: jest.fn().mockResolvedValue([]),
            findByCandidateId: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<InternshipService>(InternshipService);
    repository = module.get<InternshipRepository>(InternshipRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new internship', async () => {
    const internship = new Internship();
    const newInternship = new Internship();
    jest.spyOn(repository, 'create').mockReturnValue(newInternship);
    jest.spyOn(repository, 'save').mockResolvedValue(newInternship);
    const result = await service.create(internship);
    expect(result).toBe(newInternship);
    expect(repository.create).toHaveBeenCalledWith(internship);
    expect(repository.save).toHaveBeenCalledWith(newInternship);
  });

  it('should find all internships', async () => {
    const internships = [new Internship()];
    jest.spyOn(repository, 'find').mockResolvedValue(internships);
    const result = await service.findAll();
    expect(result).toBe(internships);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one internship by id', async () => {
    const internship = new Internship();
    jest.spyOn(repository, 'findOne').mockResolvedValue(internship);
    const result = await service.findOne('some-id');
    expect(result).toBe(internship);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should update an internship', async () => {
    const internship = new Internship();
    const updatedInternship = new Internship();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedInternship);
    const result = await service.update('some-id', internship);
    expect(result).toBe(updatedInternship);
    expect(repository.update).toHaveBeenCalledWith('some-id', internship);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should delete an internship', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await service.delete('some-id');
    expect(repository.delete).toHaveBeenCalledWith('some-id');
  });

  it('should find all internships by company id', async () => {
    const internships = [new Internship()];
    jest
      .spyOn(repository, 'findInternshipsByCompanyId')
      .mockResolvedValue(internships);
    const result = await service.findInternshipsByCompanyId('company-id');
    expect(result).toBe(internships);
    expect(repository.findInternshipsByCompanyId).toHaveBeenCalledWith(
      'company-id',
    );
  });

  it('should find all internships by student id', async () => {
    const internships = [new Internship()];
    jest.spyOn(repository, 'findByCandidateId').mockResolvedValue(internships);
    const result = await service.findByCandidateId('student-id');
    expect(result).toBe(internships);
    expect(repository.findByCandidateId).toHaveBeenCalledWith('student-id');
  });
});
