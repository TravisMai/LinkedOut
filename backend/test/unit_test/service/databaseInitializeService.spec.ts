import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseInitializerService } from '../../../src/common/service/databaseInitialize.service';
import { DataSource, QueryRunner } from 'typeorm';

describe('DatabaseInitializerService', () => {
  let service: DatabaseInitializerService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseInitializerService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => queryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseInitializerService>(
      DatabaseInitializerService,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call createQueryRunner', async () => {
    const createQueryRunnerSpy = jest.spyOn(dataSource, 'createQueryRunner');
    await service.onModuleInit();
    expect(createQueryRunnerSpy).toHaveBeenCalled();
  });

  it('should call queryRunner.connect', async () => {
    await service.onModuleInit();
    expect(queryRunner.connect).toHaveBeenCalled();
  });

  it('should call queryRunner.query', async () => {
    await service.onModuleInit();
    expect(queryRunner.query).toHaveBeenCalledWith(
      'CREATE EXTENSION IF NOT EXISTS unaccent',
    );
  });

  it('should call queryRunner.release', async () => {
    await service.onModuleInit();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
