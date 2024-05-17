import { Test, TestingModule } from '@nestjs/testing';
import { Company } from 'src/module/company/company.entity';
import { CompanyRepository } from 'src/module/company/company.repository';
import { CompanyService } from 'src/module/company/company.service';
import { CompanyUpdateDto } from 'src/module/company/dto/companyUpdate.dto';

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: CompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            createCompany: jest.fn().mockReturnValue(new Company()),
            save: jest.fn().mockResolvedValue(new Company()),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<CompanyRepository>(CompanyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all companies', async () => {
    const companies = [new Company()];
    jest.spyOn(repository, 'find').mockResolvedValue(companies);
    const result = await service.findAll();
    expect(result).toBe(companies);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one company by id', async () => {
    const company = new Company();
    jest.spyOn(repository, 'findOne').mockResolvedValue(company);
    const result = await service.findOne('some-id');
    expect(result).toBe(company);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should create a new company', async () => {
    const company = new Company();
    const newCompany = new Company();
    jest.spyOn(repository, 'save').mockResolvedValue(newCompany);
    const result = await service.create(company);
    expect(result).toBe(newCompany);
    expect(repository.createCompany).toHaveBeenCalledWith(company);
    expect(repository.save).toHaveBeenCalledWith(newCompany);
  });

  it('should update a company', async () => {
    const companyUpdateDto = new CompanyUpdateDto();
    const updatedCompany = new Company();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedCompany);
    const result = await service.update('some-id', companyUpdateDto);
    expect(result).toBe(updatedCompany);
    expect(repository.update).toHaveBeenCalledWith('some-id', companyUpdateDto);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should delete a company', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await service.delete('some-id');
    expect(repository.delete).toHaveBeenCalledWith({ id: 'some-id' });
  });

  it('should find company by email', async () => {
    const company = new Company();
    jest.spyOn(repository, 'findOne').mockResolvedValue(company);
    const result = await service.findByEmail('test@example.com');
    expect(result).toBe(company);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should find company by anything', async () => {
    const company = new Company();
    jest.spyOn(repository, 'findOne').mockResolvedValue(company);
    const result = await service.findByAnything('test@example.com');
    expect(result).toBe(company);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: [
        { name: 'test@example.com' },
        { email: 'test@example.com' },
        { phoneNumber: 'test@example.com' },
      ],
    });
  });
});
