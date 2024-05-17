import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../../src/module/redis/redis.service';
import { commonAttribute } from '../../../src/common/entities/commonAttribute.entity';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getObjectByKey: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate jwt token', () => {
    const base: commonAttribute = {
      id: '1',
      name: 'test',
      email: 'test@example.com',
      role: 'user',
      phoneNumber: '',
      avatar: '',
      created: undefined,
      updated: undefined,
    };
    const jwtToken = 'jwt token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(jwtToken);

    const result = service.generateJwtToken(base);

    expect(result).toBe(jwtToken);
    expect(jwtService.sign).toHaveBeenCalledWith({
      id: base.id,
      username: base.name,
      email: base.email,
      role: base.role,
    });
  });

  it('should check if token is blacklisted', async () => {
    const token = 'some-token';
    jest.spyOn(redisService, 'getObjectByKey').mockResolvedValue(null);

    const result = await service.isTokenBlacklisted(token);

    expect(result).toBe(false);
    expect(redisService.getObjectByKey).toHaveBeenCalledWith(
      `BLACKLIST:${token}`,
    );
  });

  it('should return user information from google login', () => {
    const req = {
      user: {
        id: '1',
        name: 'test',
      },
    };

    const result = service.googleLogin(req);

    expect(result).toEqual({
      message: 'User information from google',
      user: req.user,
    });
  });

  it('should return no user from google login', () => {
    const req = {
      user: null,
    };

    const result = service.googleLogin(req);

    expect(result).toBe('No user from google');
  });
});
