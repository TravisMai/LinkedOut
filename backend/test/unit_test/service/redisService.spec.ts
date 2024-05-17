import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../../../src/module/redis/redis.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RedisService', () => {
  let service: RedisService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get object by key', async () => {
    const key = 'key';
    const value = 'value';
    jest.spyOn(cache, 'get').mockResolvedValue(value);
    const result = await service.getObjectByKey(key);
    expect(result).toBe(value);
    expect(cache.get).toHaveBeenCalledWith(key);
  });

  it('should set object by key value', async () => {
    const key = 'key';
    const value = 'value';
    const ttl = 1000;
    jest.spyOn(cache, 'set').mockResolvedValue(undefined);
    const result = await service.setObjectByKeyValue(key, value, ttl);
    expect(result).toBe(undefined);
    expect(cache.set).toHaveBeenCalledWith(key, value, { ttl });
  });

  it('should delete object by key', async () => {
    const key = 'key';
    jest.spyOn(cache, 'get').mockResolvedValue(true);
    jest.spyOn(cache, 'del').mockResolvedValue(undefined);
    const result = await service.deleteObjectByKey(key);
    expect(result).toBe(undefined);
    expect(cache.get).toHaveBeenCalledWith(key);
    expect(cache.del).toHaveBeenCalledWith(key);
  });
});
