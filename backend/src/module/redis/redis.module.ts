import { RedisService } from './redis.service';
import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        // auth_pass: configService.get('REDIS_PASSWORD'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
        ssl: true,
        // tls: {
        //     host: configService.get('REDIS_HOST'),
        // }
      }),
    }),
  ],
  controllers: [],
  providers: [RedisService, Logger],
  exports: [RedisService],
})
export class RedisModule {}
