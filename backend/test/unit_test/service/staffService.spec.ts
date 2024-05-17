import { Test, TestingModule } from '@nestjs/testing';
import { StaffUpdateDto } from 'src/module/staff/dto/staffUpdate.dto';
import { Staff } from 'src/module/staff/staff.entity';
import { StaffRepository } from 'src/module/staff/staff.repository';
import { StaffService } from 'src/module/staff/staff.service';

describe('StaffService', () => {
  let service: StaffService;
  let repository: StaffRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: StaffRepository,
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            createStaff: jest.fn().mockReturnValue(new Staff()),
            save: jest.fn().mockResolvedValue(new Staff()),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            findByEmail: jest.fn().mockResolvedValue(null),
            getRandomStaff: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repository = module.get<StaffRepository>(StaffRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all staff', async () => {
    const staffs = [new Staff()];
    jest.spyOn(repository, 'find').mockResolvedValue(staffs);
    const result = await service.findAll();
    expect(result).toBe(staffs);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one staff by id', async () => {
    const staff = new Staff();
    jest.spyOn(repository, 'findOne').mockResolvedValue(staff);
    const result = await service.findOne('some-id');
    expect(result).toBe(staff);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should create a new staff', async () => {
    const staff = new Staff();
    const newStaff = new Staff();
    jest.spyOn(repository, 'save').mockResolvedValue(newStaff);
    const result = await service.create(staff);
    expect(result).toBe(newStaff);
    expect(repository.createStaff).toHaveBeenCalledWith(staff);
    expect(repository.save).toHaveBeenCalledWith(newStaff);
  });

  it('should update a staff', async () => {
    const staffUpdateDto = new StaffUpdateDto();
    const updatedStaff = new Staff();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedStaff);
    const result = await service.update('some-id', staffUpdateDto);
    expect(result).toBe(updatedStaff);
    expect(repository.update).toHaveBeenCalledWith('some-id', staffUpdateDto);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'some-id' },
    });
  });

  it('should delete a staff', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await service.delete('some-id');
    expect(repository.delete).toHaveBeenCalledWith({ id: 'some-id' });
  });

  it('should find staff by email', async () => {
    const staff = new Staff();
    jest.spyOn(repository, 'findOne').mockResolvedValue(staff);
    const result = await service.findByEmail('test@example.com');
    expect(result).toBe(staff);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should get a random staff', async () => {
    const staff = new Staff();
    jest.spyOn(repository, 'getRandomStaff').mockResolvedValue(staff);
    const result = await service.getRandomStaff();
    expect(result).toBe(staff);
    expect(repository.getRandomStaff).toHaveBeenCalled();
  });
});
